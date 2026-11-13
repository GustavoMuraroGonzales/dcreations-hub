import { describe, it as test } from "node:test";
import assert from "node:assert/strict";
import { productQuoteLink } from "./contact";

describe("Orçamento de produtos pelo WhatsApp", () => {
  test("direciona ao WhatsApp da empresa mesmo se o produto tiver lojas cadastradas", () => {
    const product = { name: "Porta-canetas", loja_integrada_url: "https://loja.example/item", mercado_livre_url: "https://marketplace.example/item" };
    const url = new URL(productQuoteLink(product));
    assert.equal(url.origin, "https://wa.me");
    assert.equal(url.pathname, "/5515996833192");
  });

  test("preenche automaticamente o produto na mensagem de orçamento, preservando acentos e símbolos", () => {
    const url = new URL(productQuoteLink({ name: "Suporte Advocacia — José & Cia #1" }));
    assert.equal(url.searchParams.get("text"), 'Olá! Vim pelo site da Gonza3DLab e gostaria de fazer um orçamento para o produto "Suporte Advocacia — José & Cia #1".');
    assert.deepEqual([...url.searchParams.keys()], ["text"]);
  });
});