export function delete_cookies() {
  document.cookie.split(";").forEach(function (c) {
    document.cookie = c
      .replace(/^ +/, "")
      .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
  });
}

export function format_date(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return date.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
}
