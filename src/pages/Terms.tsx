
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const Terms = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
            <div className="mb-6">
              <Link to="/register" className="inline-flex items-center text-primary hover:text-primary-700">
                <ArrowLeft className="w-4 h-4 mr-2" />
                <span>Voltar para Cadastro</span>
              </Link>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Termos e Condições</h1>
            
            <div className="prose max-w-none">
              <h2>1. Aceitação dos Termos</h2>
              <p>
                Ao utilizar o aplicativo Reclama Pirapetinga, você concorda em cumprir e estar sujeito a estes Termos e Condições de Uso. Se você não concordar com qualquer parte destes termos, por favor, não utilize nosso serviço.
              </p>
              
              <h2>2. Descrição do Serviço</h2>
              <p>
                O Reclama Pirapetinga é uma plataforma que permite aos cidadãos reportar problemas urbanos na cidade de Pirapetinga, facilitando a comunicação entre a comunidade e os órgãos responsáveis.
              </p>
              
              <h2>3. Cadastro e Informações da Conta</h2>
              <p>
                Para utilizar completamente nossa plataforma, é necessário criar uma conta. As informações fornecidas durante o cadastro devem ser precisas e atualizadas. Você é responsável por manter a confidencialidade de sua senha e pela atividade que ocorre em sua conta.
              </p>
              
              <h2>4. Uso Adequado</h2>
              <p>
                Ao utilizar o Reclama Pirapetinga, você concorda em:
              </p>
              <ul>
                <li>Não publicar conteúdo falso, enganoso, difamatório ou malicioso;</li>
                <li>Não utilizar o serviço para fins ilegais ou não autorizados;</li>
                <li>Não interferir no funcionamento normal do serviço.</li>
              </ul>
              
              <h2>5. Conteúdo do Usuário</h2>
              <p>
                Ao enviar denúncias, fotos ou comentários, você concede ao Reclama Pirapetinga uma licença mundial, não exclusiva, livre de royalties para usar, reproduzir e distribuir esse conteúdo em conexão com o serviço.
              </p>
              
              <h2>6. Privacidade</h2>
              <p>
                Nossa Política de Privacidade descreve como coletamos, usamos e protegemos suas informações pessoais. Ao usar nosso serviço, você concorda com a coleta e uso de informações de acordo com esta política.
              </p>
              
              <h2>7. Modificações nos Termos</h2>
              <p>
                O Reclama Pirapetinga reserva-se o direito de modificar estes termos a qualquer momento. Ao continuar a usar o serviço após tais alterações, você concorda com os novos termos.
              </p>
              
              <h2>8. Limitação de Responsabilidade</h2>
              <p>
                O Reclama Pirapetinga não garante que o serviço atenderá às suas necessidades, será ininterrupto, seguro ou livre de erros. Em nenhum caso o Reclama Pirapetinga será responsável por danos indiretos, incidentais ou consequenciais.
              </p>
              
              <h2>9. Lei Aplicável</h2>
              <p>
                Estes Termos são regidos pelas leis do Brasil. Qualquer disputa relacionada a estes Termos será submetida à jurisdição exclusiva dos tribunais de Minas Gerais.
              </p>
              
              <h2>10. Contato</h2>
              <p>
                Se você tiver dúvidas sobre estes Termos, entre em contato conosco através do e-mail: contato@reclamapirapetinga.com.br
              </p>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-100">
              <p className="text-sm text-gray-600">
                Última atualização: 07 de maio de 2025
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Terms;
