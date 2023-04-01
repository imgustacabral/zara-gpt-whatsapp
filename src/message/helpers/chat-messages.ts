function getHelpMessage(): string {
  return `
    🤖 Bem-vindo! Eu sou o seu assistente virtual. Aqui estão as funcionalidades disponíveis:
    
    💬 Conversação: Você pode conversar comigo e me perguntar qualquer coisa. Basta me enviar uma mensagem!
        
    🎨 Geração de imagens: Você também pode gerar imagens incríveis usando o comando /imagine e fornecendo um prompt.
    
    🗑 Limpeza de histórico: Se quiser limpar o histórico de mensagens, é só usar o comando /clear
    
    👀 Quer ficar de olho em novas funcionalidades? é só enviar um /features
        
    👋 Se precisar de ajuda em algum momento, é só chamar! Estou aqui para ajudá-lo.`;
}

function getDonationMessage(): string {
  return `
    🙌 Olá! Você ama a ideia de IA WhatsApp que pode ajudar no dia a dia? 🤖
  
    🎉 Nós estamos construindo isso agora! Mas para continuar precisamos de sua ajuda.
      
    👉 Cada doação é importante e ajuda a manter e aprimorar o projeto. Use a chave PIX abaixo para fazer uma doação agora mesmo e faça parte da nossa missão de tornar IA's acessíveis para todos.
  
    🚀 Sua contribuição fará uma grande diferença para nós e para a comunidade. Obrigado pela sua generosidade! 😊
  
    🙏 Basta enviar a mensagem doar ou /doar🙏 `;
}

function getThankYouMessage(): string {
  return `
    🥳🥳 Muitooo obrigado 🥳🥳
      
    PIX CNPJ: 44.938.545-0001/19
  
    Sua contribuição é essencial
    para mantermos o projeto!
        `;
}

function getClearChatSuccessMessage(): string {
  return `Histórico limpo com sucesso, como posso te ajudar hoje? `;
}

export {
  getDonationMessage,
  getHelpMessage,
  getThankYouMessage,
  getClearChatSuccessMessage,
};
