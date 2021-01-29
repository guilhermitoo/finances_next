import Head from 'next/head';
import {useEffect,useState} from 'react';
import api from '../lib/db.js';

export default function Home() {
  const mes = 'Janeiro';
  const [contas,SetContas] = useState([]);

  useEffect(() => {
    loadContas();
  },[]);

  async function loadContas() {
    let dt = new Date();
    dt = new Date(dt.getFullYear(),dt.getMonth()+1,0);

    let first_day = new Date(dt.getFullYear(),dt.getMonth(),1,0,0,0);
    let last_day = new Date(dt.getFullYear(),dt.getMonth(),dt.getDate(),23,59,59);
    
    console.log({first_day,last_day});

    await api.get('/contas.json',{}).then(response => {
        let res = response.data.filter((obj) => { 
          return ((new Date(obj.data) >= first_day) && (new Date(obj.data) <= last_day)); 
        });
        console.log(res);
        SetContas(res);
    });    
  }

  return (
    <div class="bg-gray-100">
      <Head>
        <title>Finances</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main class="flex flex-col mx-auto px-4 md:w-1/2 h-screen">
        <h1 class="mx-auto font-bold text-xl my-4">Contas do mês de {mes}</h1>
        <div class="overflow-auto">
          <div class="mx-auto w-full h-8 bg-gray-300 rounded-xl mb-2 flex flex-row font-semibold">
            <h1 class="mx-2 my-auto w-2/6">Descrição</h1>
            <h1 class="mx-2 my-auto w-1/6">Dia Venc.</h1>
            <h1 class="mx-2 my-auto w-1/6">Parcela</h1>
            <h1 class="mx-2 my-auto w-1/6 flex flex-row-reverse">Valor</h1>
          </div>
          {contas.map(ct => (
            <div class="mx-auto w-full h-12 bg-red-700 rounded-xl mb-2 flex flex-row text-white font-semibold">
              <h1 class="mx-2 my-auto w-2/6">{ct.descricao}</h1>
              <h1 class="mx-2 my-auto w-1/6">{ct.dia}</h1>
              <h1 class="mx-2 my-auto w-1/6">{ct.parcela}</h1>
              <h1 class="mx-2 my-auto w-1/6 flex flex-row-reverse">{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(ct.valor)}</h1>
            </div>  
          ))}
        </div>
      </main>

      <footer>
      </footer>
    </div>    
  )
}
