import Page from '../../components/page';
import {useEffect, useState} from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/client';
import {FaTerminal, FaTrashAlt} from 'react-icons/fa';
import { stringify } from 'postcss';

const apiLocal = axios.create();

export default function Conta () {
  const [session,ldng ] = useSession();    
  const [list,SetList] = useState();
  const [bancos,SetBancos] = useState([]);
  const [nome,SetNome] = useState('');
  const [loading,SetLoading] = useState(true);

  // loading
  useEffect(() => {
    if (!document.querySelector(`#pnl_loading`)) return
    if (loading) {
      document.querySelector(`#pnl_loading`).classList.remove("hidden");
      document.querySelector(`#pnl_lista`).classList.add("hidden");
      document.querySelector(`#btn_cad`).disabled = true;
    } else {
      document.querySelector(`#pnl_loading`).classList.add("hidden");
      document.querySelector(`#pnl_lista`).classList.remove("hidden");     
      document.querySelector(`#btn_cad`).disabled = false;
    }
  },[loading]);

  useEffect(() => {
    loadBancos();  
    // console.log(JSON.stringify(session));
  },[ldng]);

  useEffect(() => {
    loadList();    
  },[bancos]);

  async function loadBancos() {
    SetLoading(true);    
    if (!session) return;

    await apiLocal.get(`/api/banks`,{}).then(response => {      
      SetLoading(false);
      SetBancos(response.data);
    }); 
  }

  function getItemClass(c,ind) {
    if (ind % 2 === 0) {
      return c + ' bg-gray-100'
    } else {
      return c
    }
  }

  async function handleDelete(ct) {
    if (!confirm(`Confirma exclusão de ${ct.nome}?`)) {
      return
    }
    await apiLocal.delete(`/api/banks?id=${ct.id}`).then(response => {
      loadBancos();      
    });
  }

  async function handleInsert() {
    let nm = String(nome).trim();

    document.querySelector(`#btn_cad`).disabled = true;
    setTimeout(function() {
      document.querySelector(`#btn_cad`).disabled = false;
    },2000);

    // valida nome vazio
    if ( nm === "" ) {
      alert("Nome inválido ou não informado!");
      SetNome('');
      return;
    }
    
    // valida nome já cadastrado
    if (bancos.length === 0 ) {
      Insert(nome);
    } else {
      bancos.forEach((val,index,arr) => {
        if (bancos[index].nome === nm) {
          alert("Nome já cadastrado!");
          return;
        }
        if (index === bancos.length -1) {
          Insert(nome);
        }
      });    
    }
  }   

  function Insert(nome) {
    apiLocal.post(`/api/banks`,{
      nome
    }).then(response => {
      if (response.status = 200) {
        loadBancos();
        SetNome('');
      }   
    });    
  }

  function loadList() {
    if (!bancos) return;
    SetList(
      bancos.map(ct => (
        <div>
          <div key={ct.id} class={getItemClass(' mx-auto w-full h-12 flex flex-row font-semibold',ct.ind)}>
            <h1 class="mx-2 my-auto w-full text-gray-800">{ct.nome}</h1>
            <h1 class="mr-2 my-auto w-auto flex flex-row-reverse">
              <button class="appearence-none focus:outline-none text-gray-700 hover:text-gray-900"
                onClick={() => handleDelete(ct)}>
                <FaTrashAlt size={24} class="mx-1" />
              </button>
            </h1>
          </div>            
        </div>
      ))
    )
  }

  return (
      <Page>
        <div class="flex flex-col h-full">
          <div class="flex flex-row w-full">
            <button class="w-3/6 bg-gray-600 my-2 py-2 px-4 font-semibold text-white shadow appearence-none focus:outline-none hover:bg-gray-800 rounded-xl"
              onClick={(e) => {
                e.preventDefault();
                window.location.replace("/");
              }}>Voltar à página principal
            </button>
            <div class="flex w-3/6 flex-row-reverse">
              {/* <button class="bg-blue-600 hover:bg-blue-800 my-2 py-2 px-4 font-semibold text-white shadow-lg appearence-none focus:outline-none rounded-xl">
              Novo Banco/Conta</button> */}
            </div>
          </div>
          <div class="bg-gray-200 rounded shadow w-full flex flex-row ">
              <div class="w-full m-2">
                <h1 class="font-semibold">Descrição do Banco/Conta</h1>
                <input class="w-full appearence-none focus:outline-none p-2 my-1 border-gray-1 border-1 rounded shadow"
                value={nome} onChange={e => SetNome(e.target.value)}></input>
              </div>           
              <div class="w-auto flex mx-auto pb-2 pt-4 mt-2 flex-row-reverse">
              <button class="appearence-none focus:outline-none mx-2 bg-blue-500 hover:bg-blue-700 px-2 rounded-lg font-semibold text-white"
                    onClick={handleInsert}
                    id="btn_cad"
                    >Cadastrar</button>
              </div>   
          </div>
          <div class="border border-gray-200 rounded w-full mt-2 flex flex-grow mb-4">
            <div class="m-auto" id="pnl_loading">
              <div class="lds-default"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
            </div>

            <div class="overflow-auto w-full hidden" id="pnl_lista">
              {list}
            </div>
          </div>
        </div>
      </Page>
  )
};