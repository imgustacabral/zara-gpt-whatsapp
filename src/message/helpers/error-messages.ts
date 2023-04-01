function getCannotGenerateImageError() {
  return `Desculpe, não foi possivel gerar a imagem com seu prompt
Por favor tente novamente!`;
}

function getServiceUnavailableError() {
  return 'Serviço indisponível no momento. Por favor, tente novamente mais tarde.';
}

export { getCannotGenerateImageError, getServiceUnavailableError };
