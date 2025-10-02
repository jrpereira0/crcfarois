export default function TermosUso() {
  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Termos de Uso
          </h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Última atualização:</strong>{" "}
              {new Date().toLocaleDateString("pt-BR")}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                1. Aceitação dos Termos
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Ao acessar e usar o site da CRC Faróis, você concorda em cumprir
                e estar vinculado a estes Termos de Uso. Se você não concordar
                com qualquer parte destes termos, não deve usar nosso site.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                2. Descrição do Serviço
              </h2>
              <p className="text-gray-700 leading-relaxed">
                A CRC Faróis oferece através deste site informações sobre nossos
                produtos e serviços, bem como a possibilidade de entrar em
                contato conosco e, para clientes cadastrados, realizar pedidos
                através de nossa plataforma B2B.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                3. Uso Permitido
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    3.1 Você pode:
                  </h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Navegar e visualizar o conteúdo do site</li>
                    <li>
                      Entrar em contato conosco através dos formulários
                      disponíveis
                    </li>
                    <li>Fazer pedidos se for um cliente cadastrado</li>
                    <li>Compartilhar links do nosso site</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    3.2 Você não pode:
                  </h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>
                      Usar o site para atividades ilegais ou não autorizadas
                    </li>
                    <li>Tentar hackear, interferir ou danificar o site</li>
                    <li>
                      Copiar, reproduzir ou distribuir conteúdo sem autorização
                    </li>
                    <li>
                      Usar informações obtidas no site para spam ou marketing
                      não solicitado
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                4. Cadastro e Conta de Usuário
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Para acessar certas funcionalidades do site, você pode precisar
                criar uma conta. Ao criar uma conta, você concorda em:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Fornecer informações precisas e atualizadas</li>
                <li>
                  Manter a confidencialidade de suas credenciais de acesso
                </li>
                <li>
                  Notificar-nos imediatamente sobre qualquer uso não autorizado
                  de sua conta
                </li>
                <li>
                  Ser responsável por todas as atividades que ocorrem em sua
                  conta
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                5. Produtos e Preços
              </h2>
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  Nos esforçamos para exibir informações precisas sobre nossos
                  produtos e preços. No entanto:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>
                    Os preços estão sujeitos a alterações sem aviso prévio
                  </li>
                  <li>A disponibilidade dos produtos pode variar</li>
                  <li>
                    Reservamo-nos o direito de corrigir erros de preço ou
                    informações
                  </li>
                  <li>Todas as vendas estão sujeitas à nossa aprovação</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                6. Propriedade Intelectual
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Todo o conteúdo deste site, incluindo textos, imagens, logos,
                gráficos e software, é propriedade da CRC Faróis ou de seus
                licenciadores e está protegido por leis de direitos autorais e
                outras leis de propriedade intelectual.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                7. Limitação de Responsabilidade
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                A CRC Faróis não será responsável por:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Danos diretos, indiretos, incidentais ou consequenciais</li>
                <li>Perda de dados ou lucros cessantes</li>
                <li>
                  Interrupções no serviço ou indisponibilidade temporária do
                  site
                </li>
                <li>Ações de terceiros ou links para sites externos</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                8. Política de Devolução e Garantia
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Nossos produtos são cobertos por garantia conforme especificado
                em cada produto. Para informações detalhadas sobre nossa
                política de devolução e garantia, entre em contato com nosso
                atendimento ao cliente.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                9. Modificações dos Termos
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Reservamo-nos o direito de modificar estes Termos de Uso a
                qualquer momento. As alterações entrarão em vigor imediatamente
                após a publicação no site. É sua responsabilidade revisar
                periodicamente estes termos.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                10. Lei Aplicável
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Estes Termos de Uso são regidos pelas leis brasileiras. Qualquer
                disputa será resolvida nos tribunais competentes da cidade de
                São Bernardo do Campo, São Paulo.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                11. Contato
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Se você tiver dúvidas sobre estes Termos de Uso, entre em
                contato conosco:
              </p>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700">
                    <strong>E-mail:</strong> contato@crcfarois.ind.br
                    <br />
                  <strong>Telefone:</strong> (11) 99226-8645
                  <br />
                  <strong>Endereço:</strong> Rua Senador Flaquer 916 - Centro
                  Santo André - SP (Administrativo)
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
