import { describe, expect, test } from "bun:test";
import { productQuoteLink } from "./contact";

describe("Orçamento de produtos pelo WhatsApp", () => {
  test("direciona ao WhatsApp da empresa mesmo se o produto tiver lojas cadastradas", () => {
    const product = { name: "Porta-canetas", loja_integrada_url: "https://loja.example/item", mercado_livre_url: "https://marketplace.example/item" };
    const url = new URL(productQuoteLink(product));
    expect(url.origin).toBe("https://wa.me");
    expect(url.pathname).toBe("/5515996833192");
  });

  test("preenche automaticamente o produto na mensagem de orçamento, preservando acentos e símbolos", () => {
    const url = new URL(productQuoteLink({ name: "Suporte Advocacia — José & Cia #1" }));
    expect(url.searchParams.get("text")).toBe('Olá! Vim pelo site da Gonza3DLab e gostaria de fazer um orçamento para o produto "Suporte Advocacia — José & Cia #1".');
    expect([...url.searchParams.keys()]).toEqual(["text"]);
  });
});