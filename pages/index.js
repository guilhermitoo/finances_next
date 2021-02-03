import Head from 'next/head';
import {useEffect,useState} from 'react';
import axios from 'axios';
import {FaCheckCircle, FaDirections} from 'react-icons/fa';
import {getNextMonth,getMonthName} from '../global.js';

const apiLocal = axios.create();

export default function Home() {
  const [fbData,SetFbData] = useState([]);
  const [_data,Set_Data] = useState();
  const [mes,SetMes] = useState();
  const [ano,SetAno] = useState();
  const [contas,SetContas] = useState([]);
  const [bancos,SetBancos] = useState([
    "Banco do Brasil Gui", "NuBank Gui", "NuBank Paula"
  ]);
  const [list,SetList] = useState();

  useEffect(() => {
    loadFbData();
  },[]);

  useEffect(() => {
    loadContas(new Date('2021-01-01 00:00:00'));
  },[fbData]);

  useEffect(() => {
    loadList();
  },[contas]);

  async function loadFbData() {
    await apiLocal.get('/api/bills',{}).then(response => {      
      SetFbData(response.data);
    });     
  }

  async function loadContas(dt) {
    Set_Data(dt);
    dt = new Date(dt.getFullYear(),dt.getMonth()+1,0);

    let first_day = new Date(dt.getFullYear(),dt.getMonth(),1,0,0,0);
    let last_day = new Date(dt.getFullYear(),dt.getMonth(),dt.getDate(),23,59,59);

    SetMes(getMonthName(first_day.getMonth()));
    SetAno(first_day.getFullYear());

    let res = fbData.filter((obj) => { 
      return ((new Date(obj.data) >= first_day) && (new Date(obj.data) <= last_day)); 
    });
      
    SetContas(res);
  }

  function getItemClass(valor) {
    let c = 'mx-auto w-full h-12 rounded-xl flex flex-row text-white font-semibold cursor-pointer';
    if (isAboveZero(valor)) {
      return c + ' bg-green-500'
    } else {
      return c + ' bg-red-500'
    }
  }

  function isAboveZero(valor) {
    return (valor > 0);
  }

  function showPanel(conta) {
    document.querySelector(`#box${conta.id}`).classList.toggle("hidden");
  }

  function handleEdit(conta) {
    conta.data_pagamento = new Date().toJSON();
    loadList();
  }

  function getBancoSelect() {
    return  <select class="w-2/3 appearence-none focus:outline-none p-2 m-2 border-gray-1 border-1 rounded shadow">
              {bancos.map(bc => (
                <option>{bc}</option>
              ))} 
              
            </select>
  }

  function handleDataPChange(e,ct) {
    //  ESTA ALTERANDO DIRETAMENTE O ARRAY. O CORRETO É ALTERAR UMA VARIÁVEL DE CONTROLE E
    //  DEIXAR PARA O CONFIRMAR SALVAR NO ARRAY E MANDAR PRO BANCO
    // ct.data_pagamento = e.target.value;
    // loadList();
  }

  function loadList() {
    SetList(
      contas.map(ct => (
        <div>
          <div key={ct.id} class={getItemClass(ct.valor)} onClick={() => showPanel(ct)}>
            <h1 class="mx-2 my-auto w-4/12">{ct.descricao}</h1>
            <h1 class="mx-2 my-auto w-1/12">{ct.dia}</h1>
            <h1 class="mx-2 my-auto w-2/12">{ct.parcela}</h1>
            <h1 class="mx-2 my-auto w-4/12 flex flex-row-reverse">{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(ct.valor)}</h1>
            <h1 class="mx-2 my-auto w-1/12 flex flex-row-reverse">{ct.data_pagamento ? <FaCheckCircle size={24} class="mx-1" /> : <div></div>}</h1>
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
                  value={ct.valor}></input>
              </div>              
              <div class="w-full flex flex-row">
                <div class="w-1/3 my-auto">
                  <text class="font-semibold">Conta</text>
                </div>
                {getBancoSelect()}
              </div>
              <div class="flex flex-row-reverse">
                <button class="appearence-none focus:outline-none my-2 mr-2 bg-blue-500 hover:bg-blue-700 p-2 rounded-lg font-semibold text-white"
                  onClick={() => handleEdit(ct)}>Confirmar</button>
              </div>
            </div>            
          </div>
        </div>
      ))
    )
  }

  async function NextMonth() {
    let dt = await getNextMonth(_data,1);
    loadContas(dt);
  }

  async function PreviousMonth() {
    let dt = await getNextMonth(_data,-1);
    loadContas(dt);
  }

  return (
    <div class="bg-gray-100 text-xs md:text-sm lg:text-base">
      <Head>
        <title>Finances</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main class="flex flex-col mx-auto px-4 md:w-1/2 h-screen">
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
            <div class="mx-2 my-auto w-1/12 flex flex-row-reverse"></div>
          </div>
          <div class="overflow-auto">
            {list}
          </div>
        </div>
      </main>

      <footer>
      </footer>
    </div>    
  )
}
