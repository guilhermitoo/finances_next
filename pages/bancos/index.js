import Page from '../../components/page'

export default function Conta () {
  
  return (
      <Page>
        <div class="flex">
          <button class="bg-gray-600 my-2 py-2 px-4 font-semibold text-white shadow-lg appearence-none focus:outline-none hover:bg-gray-800 rounded-xl"
            onClick={(e) => {
              e.preventDefault();
              window.location.replace("/");
            }}>Voltar à página principal
          </button>
        </div>
        Conta/Banco
      </Page>
  )
};