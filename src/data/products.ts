export type ProductCategory = "miniaturas" | "tecnicas" | "personalizados" | "prototipos";

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  shortDescription: string;
  description: string;
  price: number | null; // null = "sob consulta"
  material: string;
  color: string; // tailwind gradient hint
}

export const categoryLabels: Record<ProductCategory, string> = {
  miniaturas: "Miniaturas",
  tecnicas: "Peças técnicas",
  personalizados: "Personalizados",
  prototipos: "Protótipos",
};

export const products: Product[] = [
  {
    id: "mini-dragao",
    name: "Miniatura Dragão Ancestral",
    category: "miniaturas",
    shortDescription: "Miniatura detalhada para RPG e coleção.",
    description:
      "Impressa em resina de alta resolução, com detalhes finos de escamas e asas. Ideal para RPG de mesa, dioramas e coleção.",
    price: 89,
    material: "Resina 8K",
    color: "from-orange-500/40 to-orange-800/60",
  },
  {
    id: "suporte-headset",
    name: "Suporte de Headset Modular",
    category: "tecnicas",
    shortDescription: "Organiza fone e cabos na sua mesa.",
    description:
      "Suporte de mesa para headset com passagem de cabos integrada. PLA reforçado, acabamento fosco. Personalizável em várias cores.",
    price: 65,
    material: "PLA Premium",
    color: "from-slate-600/40 to-slate-900/60",
  },
  {
    id: "vaso-geometrico",
    name: "Vaso Geométrico Espiral",
    category: "personalizados",
    shortDescription: "Vaso decorativo em vase mode.",
    description:
      "Vaso decorativo impresso em espiral contínua. Camadas finas criam um efeito de textura elegante. Tamanhos e cores sob pedido.",
    price: 55,
    material: "PLA Silk",
    color: "from-blue-500/40 to-blue-900/60",
  },
  {
    id: "prototipo-carcaca",
    name: "Protótipo de Carcaça Eletrônica",
    category: "prototipos",
    shortDescription: "Prototipagem funcional sob demanda.",
    description:
      "Fabricação de protótipos funcionais a partir do seu arquivo STL ou desenho. Ideal para validação de produto, gabinetes e encaixes.",
    price: null,
    material: "PETG / ABS",
    color: "from-orange-600/40 to-slate-900/60",
  },
  {
    id: "mini-cidade",
    name: "Kit Miniaturas Urbanas",
    category: "miniaturas",
    shortDescription: "Prédios em escala para maquete.",
    description:
      "Conjunto de 6 prédios em miniatura para maquetes arquitetônicas e cenários de jogos. Escala configurável.",
    price: 149,
    material: "PLA",
    color: "from-slate-500/40 to-slate-800/60",
  },
  {
    id: "engrenagem-custom",
    name: "Engrenagem Personalizada",
    category: "tecnicas",
    shortDescription: "Reposição de peças mecânicas.",
    description:
      "Fabricamos engrenagens, buchas e peças de reposição sob medida a partir de suas medidas ou peça original. Materiais resistentes.",
    price: null,
    material: "PETG / Nylon",
    color: "from-blue-600/40 to-slate-900/60",
  },
  {
    id: "chaveiro-nome",
    name: "Chaveiro com Nome",
    category: "personalizados",
    shortDescription: "Personalize com nome ou logo.",
    description:
      "Chaveiro impresso em PLA colorido com seu nome, apelido ou logo. Ótimo para brindes e presentes.",
    price: 25,
    material: "PLA",
    color: "from-orange-400/40 to-orange-700/60",
  },
  {
    id: "prototipo-mecanismo",
    name: "Mecanismo Articulado",
    category: "prototipos",
    shortDescription: "Peças articuladas print-in-place.",
    description:
      "Impressão de mecanismos articulados já montados (print-in-place). Ideal para demonstrações, brinquedos técnicos e apresentações.",
    price: 120,
    material: "PLA Premium",
    color: "from-slate-700/40 to-black/70",
  },
];

export function getProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}
