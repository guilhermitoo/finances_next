import {useEffect,useState} from 'react';
import axios from 'axios';
import {FaCheckCircle, FaPlusCircle} from 'react-icons/fa';
import {getNextMonth,getMonthName} from '../global.js';
import { useSession } from 'next-auth/client';

const apiLocal = axios.create();

export default function Home() {
  const [session,ldng ] = useSession();
  const [_data,Set_Data] = useState(new Date());
  const [mes,SetMes] = useState();
  const [ano,SetAno] = useState();
  const [contas,SetContas] = useState();
  const [bancos,SetBancos] = useState();
  const [list,SetList] = useState();

  const [cad_descricao,SetCad_Descricao] = useState('');
  const [cad_dia,SetCad_Dia] = useState(10);
  const [cad_parcela,SetCad_Parcela] = useState();
  const [cad_valor,SetCad_Valor] = useState(0.00);
  const [valorTotal,SetValorTotal] = useState(0);
  const [emAberto,SetEmAberto] = useState(0);

  const [loading,SetLoading] = useState(true);

  useEffect(() => {
    updateContas();
  },[contas])

  function updateContas() {
    if ( contas ) {
      loadList();
      updateTotalizadores();
    }
  }

  function updateTotalizadores() {
    if (contas.length > 0) {
      SetValorTotal(contas.reduce(function(acc, val) { return parseFloat(acc) + parseFloat(val.valor); }, 0));
      SetEmAberto(contas.reduce(function(acc, val) 
        { 
          if (!val.data_pagamento) {
            return acc += 1;
          } else {
            return acc;
          }          
        }, 0));
    } else {
      SetValorTotal(0);
      SetEmAberto(0);
    }    
  }

  // carrega os bancos e depois as contas
  useEffect(() => {
    loadBancos();    
  },[]);

  useEffect(() => {
    SetLoading(true);
    loadContas(_data).then(c => {
      SetLoading(false);
    });
  },[bancos]);

  useEffect(() => {
    if (loading) {
      document.querySelector(`#pnl_loading`).classList.remove("hidden");
      document.querySelector(`#pnl_lista`).classList.add("hidden");
    } else {
      document.querySelector(`#pnl_loading`).classList.add("hidden");
      document.querySelector(`#pnl_lista`).classList.remove("hidden");     
    }
  },[loading]);

  async function loadBancos() {
    await apiLocal.get(`/api/banks`,{}).then(response => {      
      SetBancos(response.data);
    }); 
  }

  async function loadContas(dt) {
    let dat = String(dt.getMonth()+1) + dt.getFullYear();
    Set_Data(dt);
    SetMes(getMonthName(dt.getMonth()));
    SetAno(dt.getFullYear());
    let old_contas = contas;
    let new_contas = [];
    await apiLocal.get(`/api/bills?month=${dat}`,{}).then(response => {      
      new_contas = response.data;
      if ( old_contas !== new_contas ) {
        SetContas(new_contas);
      }
    });     
  }

  function getItemClass(c,valor) {
    if (isAboveZero(valor)) {
      return c + ' bg-green-500'
    } else {
      return c + ' bg-red-500'
    }
  }

  function isAboveZero(valor) {
    return (valor > 0);
  }

  async function importarContas() {
    if (!confirm("Confirma importação das contas do mês anterior?")) {
      return
    }

    // importar contas do mês anterior
    let _dt = await getNextMonth(_data,-1);    
    let dat = String(_dt.getMonth()+1) + _dt.getFullYear();
    SetLoading(true);
    await apiLocal.get(`/api/bills?month=${dat}`,{}).then(response => {      
      response.data.forEach(element => {
        if (element.parcela) {
          let parc = element.parcela;
          if ( parc != '' ) {
            let parcela_atual = parseInt(parc.substr(0,parc.indexOf('/')));
            let parcela_final = parseInt(parc.substr(parc.indexOf('/')+1,parc.length));
            let dat2 = String(_data.getMonth()+1) + _data.getFullYear(); 
            element.data_pagamento = '';           
            if ( parc === 'x' ) {
              apiLocal.post(`/api/bills?month=${dat2}`,element).then(response => {});
            } 
            else {
              if (parcela_atual<parcela_final) {
                element.parcela = (parcela_atual+1) + '/' + parcela_final;
                apiLocal.post(`/api/bills?month=${dat2}`,element).then(response => {});
              }
            }
          }
        }
      });      
    }).then(() => {
      loadContas(_data).then(c => {
        SetLoading(false);  
      });
    });
  }

  function showPanel(conta) {
    document.querySelector(`#box${conta.id}`).classList.toggle("hidden");
  }

  async function handleEdit(conta) {
    //conta.data_pagamento = new Date().toJSON();
    let dat = String(_data.getMonth()+1) + _data.getFullYear();
    await apiLocal.patch(`/api/bills?month=${dat}`,conta).then(response => {
      if (response.status === 200) {
        showPanel(conta);     
        updateTotalizadores();
      } else {
        alert('Erro ao editar o registro. '+str(response.statusText));
      }  
    });
  }

  async function handleDelete(conta) {
    if (!confirm('Confirma exclusão da movimentação?')) {
      return
    }
    let dat = String(_data.getMonth()+1) + _data.getFullYear();
    let cid = conta.id;
    await apiLocal.delete(`/api/bills?month=${dat}&id=${conta.id}`).then(response => {
      if (response.status === 200) {
        let lc = contas;
        lc = lc.filter(function(a) {
          if ((a.id == cid)) {
              return false;
          }
          else { return true; }                    
        });
        showPanel(conta);
        SetContas(lc);
      } else {
        alert('Erro ao excluir o registro. '+str(response.statusText));
      }      
    });
  }

  async function handleInsert() {
    let dat = String(_data.getMonth()+1) + _data.getFullYear();
    let bill_obj = {
      descricao:cad_descricao,
      dia:cad_dia,
      parcela:cad_parcela,
      valor:cad_valor,
      data:new Date().toJSON()
    };
    await apiLocal.post(`/api/bills?month=${dat}`,bill_obj).then(response => {
      document.querySelector('#nova_conta').classList.add("hidden");
      if (response.status === 200) {
        let lc = contas;
        bill_obj.usuario = session.user.email;
        bill_obj.id = response.data.name;
        lc.push(bill_obj);
        lc.sort(function(a,b) {
            return b.valor - a.valor;
        });
        SetContas(lc);
        updateContas();
      } else {
        alert('Erro ao gravar o registro. '+str(response.statusText));
      }     
    });
  }
  
  function handleBancoChange(e,ct)  {
    ct.conta_pagamento = bancos[e.target.selectedIndex];
    loadList();
  }

  function handleValorChange(e,ct) {
    ct.valor = e.target.value;
    loadList();
  }

  function handleDataPChange(e,ct) {
    //  ESTA ALTERANDO DIRETAMENTE O ARRAY. O CORRETO É ALTERAR UMA VARIÁVEL DE CONTROLE E
    //  DEIXAR PARA O CONFIRMAR SALVAR NO ARRAY E MANDAR PRO BANCO
    ct.data_pagamento = e.target.value;
    loadList();
  }

  function getBancoSelect(ct) {
    if ( bancos ) {
      return  <div class="w-2/3 flex flex-row mx-2">
              <select class="w-full appearence-none focus:outline-none py-2 my-2 mr-2 border-gray-1 border-1 rounded shadow"
                onChange={e => handleBancoChange(e,ct)}>
                {bancos.map(bc => (
                  <option key={bc.id}>{bc.nome}</option>
                ))}               
                
              </select>
              
              <a class="my-auto appearence-none focus:outline-none cursor-pointer" title="Cadastro de Contas/Bancos para Recebimento"
                onClick={(e) => {if (confirm('Confirma abertura do cadastro de Contas/Bancos para recebimento?')){
                  e.preventDefault();
                  
                  window.location.replace("/bancos");
                }}}>
                <FaPlusCircle size={26} class="text-green-700 hover:text-green-900" />
              </a>
            </div>
    }
  }

  function loadList() {
    SetList(
      contas.map(ct => (
        <div>
          <div key={ct.id} class={getItemClass('mx-auto w-full h-12 rounded-xl flex flex-row text-white font-semibold cursor-pointer',ct.valor)} onClick={() => showPanel(ct)}>
            <h1 class="mx-2 my-auto w-4/12">{ct.descricao}</h1>
            <h1 class="mx-2 my-auto w-1/12">{ct.data_pagamento ? new Date(ct.data_pagamento+"T00:00:00").getDate() : ct.dia}</h1>
            <h1 class="mx-2 my-auto w-2/12">{ct.parcela}</h1>
            <h1 class="mx-2 my-auto w-4/12 flex flex-row-reverse">{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(ct.valor)}</h1>
            <h1 class="mr-2 my-auto w-1/12 flex flex-row-reverse">{ct.data_pagamento ? <FaCheckCircle size={24} class="mx-1" /> : <div></div>}</h1>
          </div>  
          <div class="mb-1">
            <div class="bg-gray-100 shadow rounded mx-4 px-2 flex flex-col hidden" id={`box${ct.id}`}>
              <div class="w-full flex flex-row">
                <div class="w-1/3 my-auto">
                  <text class="font-semibold">Data Pag.</text>
                </div>
                <input type="date" class="w-2/3 appearence-none focus:outline-none p-2 m-2 border-gray-1 border-1 rounded shadow"
                  value={ct.data_pagamento} onChange={e => handleDataPChange(e,ct)}></input>
              </div>
              <div class="w-full flex flex-row">
                <div class="w-1/3 my-auto">
                  <text class="font-semibold">Valor</text>
                </div>
                <input type="number" class="w-2/3 appearence-none focus:outline-none p-2 m-2 border-gray-1 border-1 rounded shadow"
                  value={ct.valor} onChange={e => handleValorChange(e,ct)}></input>
              </div>              
              <div class="w-full flex flex-row">
                <div class="w-1/3 my-auto flex">
                  <text class="font-semibold">Banco/Conta</text>
                </div>
                {getBancoSelect(ct)}
              </div>
              <div class="flex flex-row-reverse">
                <div class="w-full flex flex-row-reverse">
                  <button class="appearence-none focus:outline-none my-2 mr-2 bg-blue-500 hover:bg-blue-700 p-2 rounded-lg font-semibold text-white"
                    onClick={() => handleEdit(ct)}>Confirmar</button>
                </div>
                <button class="appearence-none focus:outline-none my-2 mr-2 bg-white border border-red-500 hover:bg-red-100 p-2 rounded-lg font-semibold"
                    onClick={() => handleDelete(ct)}>Excluir</button>
              </div>
            </div>            
          </div>
        </div>
      ))
    )
  }

  async function NextMonth() {
    let dt = await getNextMonth(_data,1);
    SetLoading(true);
    loadContas(dt).then(c => {
      SetLoading(false);
    });
  }

  async function PreviousMonth() {
    let dt = await getNextMonth(_data,-1);
    SetLoading(true);
    loadContas(dt).then(c => {
      SetLoading(false);
    });
  }

  return (    
    <div class="flex flex-col h-full">
      <div class="w-full flex flex-row">
        <button class="bg-gray-600 my-2 px-4 font-semibold text-white shadow-lg appearence-none focus:outline-none hover:bg-gray-800 rounded-xl"
            onClick={PreviousMonth}>Anterior</button>
        <div class="mx-auto">
          <h1 class="mx-auto font-bold text-xl my-4">{mes} de {ano}</h1>
        </div>
        <button class="bg-gray-600 my-2 px-4 font-semibold text-white shadow-lg appearence-none focus:outline-none hover:bg-gray-800 rounded-xl" 
            onClick={NextMonth}>Próximo</button>
      </div>        
      <div class="flex flex-col flex-grow overflow-auto">
        <div class="mx-auto w-full py-2 bg-gray-300 rounded-xl mb-2 flex flex-row font-semibold">
          <div class="mx-2 my-auto w-4/12">Descrição</div>
          <div class="mx-2 my-auto w-1/12">Dia</div>
          <div class="mx-2 my-auto w-2/12">Parcela</div>
          <div class="mx-2 my-auto w-4/12 flex flex-row-reverse">Valor</div>
          <div class="mx-2 my-auto w-1/12 flex flex-row-reverse">Pago</div>
        </div>
        <button class="appearence-none focus:outline-none mb-2 rounded-xl text-lg font-semibold w-auto mx-auto" 
          onClick={() => {document.querySelector('#nova_conta').classList.toggle("hidden");}}
          title="Nova Movimentação (finança)">
          <FaPlusCircle size={32} class="mx-auto text-gray-700 hover:text-gray-900" />  
        </button>
        <div class="mb-1 hidden" id="nova_conta">
          <div class="bg-gray-100 shadow rounded-lg mx-4 px-2 flex flex-col border">
            <div class="w-full flex flex-row">
              <div class="w-1/3 my-auto">
                <text class="font-semibold">Descrição</text>
              </div>
              <input type="text" class="w-2/3 appearence-none focus:outline-none p-2 m-2 border-gray-1 border-1 rounded shadow"
                data={cad_descricao} onChange={e => SetCad_Descricao(e.target.value)}></input>
            </div>
            <div class="w-full flex flex-row">
              <div class="w-1/3 my-auto">
                <text class="font-semibold">Dia Venc.</text>
              </div>
              <input type="number" class="w-2/3 appearence-none focus:outline-none p-2 m-2 border-gray-1 border-1 rounded shadow"
                data={cad_dia} onChange={e => SetCad_Dia(e.target.value)}></input>
            </div>
            <div class="w-full flex flex-row">
              <div class="w-1/3 my-auto">
                <text class="font-semibold">Parcela</text>
              </div>
              <input type="text" class="w-2/3 appearence-none focus:outline-none p-2 m-2 border-gray-1 border-1 rounded shadow"
                data={cad_parcela} onChange={e => SetCad_Parcela(e.target.value)}></input>
            </div>
            <div class="w-full flex flex-row">
              <div class="w-1/3 my-auto">
                <text class="font-semibold">Valor</text>
              </div>
              <input type="number" class="w-2/3 appearence-none focus:outline-none p-2 m-2 border-gray-1 border-1 rounded shadow"
                data={cad_valor} onChange={e => SetCad_Valor(e.target.value)}></input>
            </div>              
            <div class="flex flex-row-reverse">
              <button class="appearence-none focus:outline-none my-2 mr-2 bg-blue-500 hover:bg-blue-700 p-2 rounded-lg font-semibold text-white"
                onClick={handleInsert}>
                Cadastrar Finança</button>
            </div>
          </div>            
        </div>          

        <div class="m-auto" id="pnl_loading">
          <div class="lds-default"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
        </div>

        <div class="overflow-auto" id="pnl_lista">
          {list}
        </div>
        
      </div>
      <div class="w-full py-2  text-lg font-semibold border-t border-gray-700 flex flex-row">
        <div>
          <label>Aberto:</label>
          <label class="px-2">{emAberto}</label>
        </div>
        <div class="w-full">
          <button class="flex mx-auto border border-gray-700 px-2 rounded-lg" onClick={importarContas}>Importar</button>
        </div>
        <div class="flex flex-row-reverse flex-grow">
          <div class="flex flex-row">
            <label class={getItemClass("font-bold rounded px-2 text-white w-32",valorTotal)}>
              {Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valorTotal)}
            </label>
          </div>
        </div>
      </div>
    </div>   
  )
}
