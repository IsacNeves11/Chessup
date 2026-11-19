# Chess Up

**Chess Up** é um site responsivo para aprender e praticar xadrez. O projeto reúne uma área de jogo local com validação de movimentos, relógio, histórico e exportação PGN, além de conteúdos introdutórios e desafios demonstrativos.

![Captura da página inicial do Chess Up](imagens/home.webp)

> **Estado atual:** o tabuleiro permite partidas locais com regras de xadrez validadas. O modo contra computador usa uma estratégia básica. Não há contas, partidas on-line ou salvamento permanente.

## O problema e a proposta

Quem está começando no xadrez pode precisar de um espaço simples para conhecer a interface de uma plataforma, visualizar um tabuleiro e encontrar conteúdos introdutórios. O Chess Up apresenta essa proposta em uma página organizada e adaptável a diferentes tamanhos de tela.

O Chess Up combina uma partida local funcional com áreas de consulta e demonstração. As partidas podem ser jogadas por duas pessoas no mesmo dispositivo ou contra um computador básico. Os desafios e os cartões de histórico geral ainda são exemplos visuais.

## Telas e áreas

| Tela ou área | O que apresenta |
|---|---|
| Início | Apresentação do Chess Up e atalhos para as seções da página. |
| Jogar | Tabuleiro ilustrativo, jogadores de exemplo, histórico de movimentos e cartões de modos de jogo. |
| Desafios | Exemplos de exercícios: Mate em um, Garfo de cavalo e Proteja suas peças. |
| Partidas | Histórico fictício para demonstrar como resultados poderiam ser exibidos. |
| Aprender | Resumos introdutórios sobre Rei, Dama, Torre, Bispo, Cavalo e Peão. |
| Sobre mim | Perfil e informações do desenvolvedor apresentados no projeto. |
| Suporte | Manual com perguntas e passos de navegação para as áreas disponíveis. |

## Tecnologias

- **HTML5:** estrutura das páginas, conteúdo semântico e elementos nativos `<details>` / `<summary>` na página de suporte.
- **CSS3:** identidade visual, layout responsivo, menu móvel e estilos da área de jogo.
- **JavaScript:** interação do tabuleiro, seleção de peças, relógios, histórico, controles e exportação de partidas.
- **chess.js 1.4.0:** validação das regras e geração de movimentos legais; carregada pelo CDN do jsDelivr.

## Como executar o projeto

Não é necessário instalar dependências ou configurar um servidor de aplicação. É necessário estar conectado à internet para carregar a biblioteca chess.js pelo CDN.

1. Clone o repositório:

   ```bash
   git clone https://github.com/IsacNeves11/Chessup.git
   ```

2. Entre na pasta:

   ```bash
   cd Chessup
   ```

3. Abra o arquivo `index.html` no navegador. Ele redireciona para `index.html`.

4. Para desenvolvimento, também é possível abrir a pasta no Visual Studio Code e iniciar o **Live Server** pelo arquivo `index.html` ou `index.html`.

Os arquivos `index.html`, `sobre.html`, `suporte.html`, `style.css` e `script.js` devem permanecer na raiz. As imagens `logo-chessup.png` e `avatar.jpg` também precisam ficar na raiz, como estão no repositório.

## Desenvolvimento

**Desenvolvimento individual:** Isac Neves.

O projeto Chess Up foi desenvolvido individualmente por Isac Neves, incluindo a estrutura das páginas em HTML, a estilização em CSS, a responsividade, a navegação entre as áreas e a documentação do protótipo.

## Captura de tela

A captura real da página inicial, registrada no navegador, está armazenada em `imagens/home.webp` e incorporada ao início deste README.

## Status do projeto

- [x] Página inicial com apresentação e áreas de xadrez.
- [x] Tabuleiro interativo com validação de movimentos legais.
- [x] Relógios Rápida (10 min), Blitz (5 min) e Bullet (1 min).
- [x] Partida local para dois jogadores e modo contra computador básico.
- [x] Desfazer jogada, virar tabuleiro e exportar partida em PGN.
- [x] Página Sobre mim.
- [x] Layout responsivo e menu móvel em HTML/CSS.
- [x] Página de suporte com perguntas e passos de navegação.
- [x] Documentação inicial do projeto.
- [x] Registrar no repositório uma captura de tela real da página inicial.
- [ ] Completar a tabela de integrantes com a divisão real das tarefas.
- [ ] Tornar os desafios interativos e avaliar as respostas.
- [ ] Criar contas e salvar histórico de partidas.
- [ ] Implementar partidas on-line e um adversário com níveis de dificuldade.

## Limitações desta versão

- As partidas são locais e acontecem no mesmo dispositivo; não há modo on-line.
- O adversário do computador usa uma estratégia simples e não oferece níveis de dificuldade.
- O relógio começa a contar após a primeira jogada.
- O estado da partida não é salvo no servidor e é perdido ao atualizar a página.
- Os cartões de desafios e o histórico geral continuam sendo exemplos demonstrativos; não há avaliação de respostas nem estatísticas pessoais.

Consulte a página [**Suporte**](suporte.html) dentro do site para orientações de navegação. Acesse também a [página inicial](index.html) e a página [Sobre mim](sobre.html).
