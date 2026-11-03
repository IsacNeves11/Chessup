# Chess Up

**Chess Up** é uma demonstração visual responsiva de uma plataforma de xadrez. O projeto reúne, em uma única interface, uma prévia de tabuleiro, exemplos de partidas, cartões de desafios e conteúdos introdutórios sobre as peças.

> **Estado atual:** esta entrega é um protótipo estático feito com HTML e CSS. Os elementos da área de jogo são demonstrativos; não há partidas reais nem processamento de jogadas.

## O problema e a proposta

Quem está começando no xadrez pode precisar de um espaço simples para conhecer a interface de uma plataforma, visualizar um tabuleiro e encontrar conteúdos introdutórios. O Chess Up apresenta essa proposta em uma página organizada e adaptável a diferentes tamanhos de tela.

A demonstração reúne áreas que poderiam compor uma plataforma de xadrez: tabuleiro, modos de partida, desafios, histórico e aprendizado. Nesta versão, essas áreas servem para apresentar o conceito e o visual do produto, não para executar partidas ou armazenar dados.

## Telas e áreas

| Tela ou área | O que apresenta |
|---|---|
| Início | Apresentação do Chess Up e atalhos para as seções da página. |
| Jogar | Tabuleiro ilustrativo, jogadores de exemplo, histórico de movimentos e cartões de modos de jogo. |
| Desafios | Exemplos de exercícios: Mate em um lance, Garfo de cavalo e Proteja suas peças. |
| Partidas | Histórico fictício para demonstrar como resultados poderiam ser exibidos. |
| Aprender | Resumos introdutórios sobre Rei, Dama, Torre, Bispo, Cavalo e Peão. |
| Sobre mim | Perfil e informações do desenvolvedor apresentados no projeto. |
| Suporte | Manual com perguntas e passos de navegação para as áreas disponíveis. |

## Tecnologias

- **HTML5:** estrutura das páginas, conteúdo semântico e elementos nativos `<details>` / `<summary>` na página de suporte.
- **CSS3:** identidade visual, layout, responsividade, menu móvel e abertura/fechamento visual do menu por meio de checkbox.
- **JavaScript:** não é utilizado nesta versão.

## Como executar o projeto

Não é necessário instalar dependências ou configurar um servidor de aplicação.

1. Clone o repositório:

   ```bash
   git clone https://github.com/IsacNeves11/Chessup.git
   ```

2. Entre na pasta:

   ```bash
   cd Chessup
   ```

3. Abra o arquivo `index.html` no navegador. Ele redireciona para `home.html`.

4. Para desenvolvimento, também é possível abrir a pasta no Visual Studio Code e iniciar o **Live Server** pelo arquivo `index.html` ou `home.html`.

Os arquivos `home.html`, `sobre.html` e `suporte.html` devem permanecer junto de `style.css`. As imagens `logo-chessup.png` e `avatar.jpg` também precisam ficar na raiz, como estão no repositório.

## Desenvolvimento

**Desenvolvimento individual:** Isac Neves.

O projeto Chess Up foi desenvolvido individualmente por Isac Neves, incluindo a estrutura das páginas em HTML, a estilização em CSS, a responsividade, a navegação entre as áreas e a documentação do protótipo.

## Captura de tela

A atividade solicita pelo menos uma captura real da página principal. Ela ainda precisa ser adicionada ao repositório. Quando a imagem estiver disponível, salve-a como `imagens/home.png` e inclua no começo do README:

```markdown
![Tela principal do Chess Up](imagens/home.png)
```

## Status do projeto

- [x] Página inicial com apresentação e áreas demonstrativas.
- [x] Página Sobre mim.
- [x] Layout responsivo e menu móvel em HTML/CSS.
- [x] Página de suporte com perguntas e passos de navegação.
- [x] Documentação inicial do projeto.
- [ ] Registrar no repositório uma captura de tela real da página inicial.
- [ ] Completar a tabela de integrantes com a divisão real das tarefas.
- [ ] Implementar partidas, movimentos de peças, desafios interativos e armazenamento de resultados (fora do escopo desta demonstração estática).

## Limitações desta versão

- O tabuleiro e as peças não permitem realizar movimentos.
- Os controles de jogo, opções de modo e formato de partida são apenas elementos visuais.
- Desafios não podem ser respondidos ou avaliados.
- O histórico e as estatísticas são exemplos fictícios; não existe salvamento de partidas.
- Não há conta de usuário, partidas online ou adversário controlado pelo computador.

Consulte a página [**Suporte**](suporte.html) dentro do site para orientações de navegação. Acesse também a [página inicial](home.html) e a página [Sobre mim](sobre.html).
