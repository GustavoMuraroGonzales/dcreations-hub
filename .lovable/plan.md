## Objetivo
Construir o site da **Gonza3DLab** com identidade visual própria (laranja, branco, azul, graphite, preto) e um catálogo de produtos preparado para receber checkout no futuro. Nesta fase, o cliente entra em contato via WhatsApp/formulário para comprar — sem pagamento online ainda.

## Estrutura do site (rotas)

```
/               Home — hero, o que fazemos, destaques, CTA
/servicos       Impressão sob demanda, prototipagem, personalizados
/catalogo       Grade de produtos (com filtros por categoria)
/produto/$id    Detalhe do produto + botão "Quero este" (WhatsApp/form)
/sobre          História da Gonza3DLab
/contato        Formulário + WhatsApp + redes sociais
```

Cada rota com SEO próprio (title, description, og).

## Identidade visual
- **Paleta**: laranja (destaque/CTAs), azul (secundário), graphite e preto (superfícies escuras), branco (fundo claro)
- **Estilo**: tech/industrial limpo — mostra a precisão da impressão 3D sem cair no clichê "neon futurista"
- Tokens definidos em `src/styles.css` (oklch), usados em toda a UI via classes semânticas
- Tipografia distinta (não Inter/Poppins padrão)

## Catálogo (sem checkout nesta fase)
- Produtos armazenados como dados locais (arquivo TS) — fácil de editar manualmente enquanto você não tem as fotos
- Cada produto: nome, categoria, descrição curta, preço (opcional/"sob consulta"), imagem placeholder
- Placeholders de imagem gerados com prompts descritivos, prontos para trocar por fotos reais depois
- Botão **"Quero este produto"** abre WhatsApp com mensagem pré-preenchida (ou formulário de contato)
- Estrutura de dados já compatível com futuro banco/checkout — quando ativarmos vendas online, migramos para Lovable Cloud + Shopify sem reescrever a UI

## O que fica pronto para a Fase 2 (checkout)
- Rotas de catálogo/produto já existem
- Modelo de dados de produto padronizado
- Ao ativar vendas: conectamos Shopify, migramos os dados e ligamos o botão "Comprar"

## Detalhes técnicos
- TanStack Start (rotas em `src/routes/`), Tailwind v4, shadcn
- Produtos em `src/data/products.ts` (array tipado)
- Componentes: `Header`, `Footer`, `ProductCard`, `ProductGrid`, `ContactForm`
- Tokens de cor e gradientes definidos em `src/styles.css`
- Metadata SEO específica por rota em `head()`
- WhatsApp: link `https://wa.me/<numero>?text=...` (vou precisar do seu número)

## O que preciso de você antes de começar
1. **Número de WhatsApp** para o botão de contato (pode ser adicionado depois se preferir)
2. **Categorias iniciais** do catálogo — sugestão: Miniaturas, Peças técnicas, Personalizados, Protótipos (posso começar com essas e você ajusta)
3. **Quantos produtos placeholder** criar no catálogo inicial (sugestão: 8, para o site não parecer vazio)