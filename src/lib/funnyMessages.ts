/**
 * Funny messages displayed during email loading - The Sims style
 */

export interface FunnyMessage {
    pt: string;
    en: string;
    es: string;
}

export const funnyMessages: FunnyMessage[] = [
    // POLÍTICA/CULTURA BR
    { pt: "Analisando se você vota em Lula ou Bolsonaro... 🤔", en: "Checking your political affiliations... 🤔", es: "Analizando tus preferencias políticas... 🤔" },
    { pt: "Contando quantos emails sobre BBB você recebeu este ano...", en: "Counting reality TV emails...", es: "Contando emails de reality shows..." },
    { pt: "Hmm, detectei memes do Casimiro na sua caixa...", en: "Found some spicy memes in your inbox...", es: "Encontré memes picantes en tu bandeja..." },
    { pt: "Procurando emails do Detran... achei! 😱", en: "Found those DMV emails you've been ignoring... 😱", es: "Encontré esos emails del gobierno que ignoraste... 😱" },
    { pt: "Calculando sua taxa de engajamento com newsletters da Globo...", en: "Calculating your news engagement rate...", es: "Calculando tu tasa de lectura de noticias..." },

    // STALKER/INVASIVO (HUMOR)
    { pt: "Acabo de ver que você ainda não jogou fora aquela cueca velha... que nojo!", en: "I see you still haven't thrown out those old socks... gross!", es: "Veo que aún no tiraste esa ropa vieja... ¡qué asco!" },
    { pt: "Seus emails de banco mostram que você ama delivery... 🍕", en: "Your bank emails show you LOVE takeout... 🍕", es: "Tus emails del banco muestran que amas el delivery... 🍕" },
    { pt: "Vi que você não abriu aquele email importante de 2019...", en: "Found that 'important' email from 2019 you never opened...", es: "Encontré ese email 'importante' de 2019 que nunca abriste..." },
    { pt: "Descobri que você tem 47 newsletters não lidas da Udemy 👀", en: "Found 47 unread course newsletters... overachiever! 👀", es: "Encontré 47 newsletters de cursos sin leer... 👀" },
    { pt: "Notei que você compra muito na Amazon às 2h da manhã...", en: "Noticed you love 2am Amazon shopping...", es: "Noté que te encanta comprar a las 2am..." },
    { pt: "Seus emails revelam que você adora procrastinar...", en: "Your emails reveal you're a professional procrastinator...", es: "Tus emails revelan que amas procrastinar..." },

    // ABSURDO TOTAL
    { pt: "Ensinando os pixels a dançarem em formação...", en: "Teaching pixels to dance in formation...", es: "Enseñando a los píxeles a bailar..." },
    { pt: "Convencendo os elétrons a cooperarem...", en: "Convincing electrons to cooperate...", es: "Convenciendo a los electrones a cooperar..." },
    { pt: "Negociando com os bytes rebeldes...", en: "Negotiating with rebellious bytes...", es: "Negociando con los bytes rebeldes..." },
    { pt: "Penteando o cabelo dos seus dados...", en: "Styling your data's hair...", es: "Peinando el cabello de tus datos..." },
    { pt: "Fazendo terapia com seus anexos traumatizados...", en: "Doing therapy with your traumatized attachments...", es: "Haciendo terapia con tus archivos traumatizados..." },
    { pt: "Dando banho nos emails sujos de spam...", en: "Bathing your spam-dirty emails...", es: "Bañando tus emails sucios de spam..." },

    // REFERÊNCIAS TECH/NERD
    { pt: "Tentando hackear a Matrix... ops, seus emails!", en: "Trying to hack the Matrix... oops, your emails!", es: "Intentando hackear la Matrix... ¡ups, tus emails!" },
    { pt: "Rodando sudo rm -rf no seu spam...", en: "Running sudo rm -rf on your spam...", es: "Ejecutando sudo rm -rf en tu spam..." },
    { pt: "Compilando suas decisões questionáveis...", en: "Compiling your questionable decisions...", es: "Compilando tus decisiones cuestionables..." },
    { pt: "Debugando a bagunça que você chama de inbox...", en: "Debugging the mess you call an inbox...", es: "Debuggeando el desastre que llamas inbox..." },
    { pt: "Git push --force na sua caixa de entrada...", en: "Git push --force on your inbox...", es: "Git push --force en tu bandeja..." },
    { pt: "Ctrl+Z naquele email constrangedor que você enviou...", en: "Ctrl+Z on that embarrassing email you sent...", es: "Ctrl+Z en ese email vergonzoso que enviaste..." },

    // COTIDIANO BRASILEIRO
    { pt: "Achei 15 cupons de desconto expirados... 💸", en: "Found 15 expired coupons... 💸", es: "Encontré 15 cupones vencidos... 💸" },
    { pt: "Contando emails de 'Última chance! 70% OFF!'...", en: "Counting 'LAST CHANCE! 70% OFF!' emails...", es: "Contando emails de '¡ÚLTIMA OPORTUNIDAD!'..." },
    { pt: "Verificando quantas senhas você resetou este ano...", en: "Counting how many passwords you reset this year...", es: "Contando cuántas contraseñas reseteaste..." },
    { pt: "Encontrei sua confirmação do Pix daquele churrasco...", en: "Found your BBQ payment confirmation...", es: "Encontré tu confirmación del asado..." },
    { pt: "Vi seu email de agendamento no SUS... boa sorte! 🏥", en: "Found your healthcare appointment... good luck! 🏥", es: "Encontré tu cita médica... ¡suerte! 🏥" },
    { pt: "Detectei 23 boletos vencidos... eita! 😅", en: "Found 23 overdue bills... yikes! 😅", es: "Encontré 23 facturas vencidas... ¡uy! 😅" },

    // COMIDA/DELIVERY
    { pt: "Hmm, você REALMENTE precisa de mais um email do iFood?", en: "Do you REALLY need another food delivery email?", es: "¿REALMENTE necesitas otro email de delivery?" },
    { pt: "Analisando sua relação tóxica com cupons de pizza...", en: "Analyzing your toxic relationship with pizza coupons...", es: "Analizando tu relación tóxica con cupones de pizza..." },
    { pt: "Contando quantas vezes você disse 'hoje eu cozinho'...", en: "Counting how many times you said 'I'll cook today'...", es: "Contando cuántas veces dijiste 'hoy cocino'..." },
    { pt: "Seus emails de restaurante contam uma história triste... 🍔", en: "Your restaurant emails tell a sad story... 🍔", es: "Tus emails de restaurantes cuentan una historia triste... 🍔" },

    // AUTOIRONIA DA IA
    { pt: "Fingindo que entendo o que estou fazendo... ✨", en: "Pretending I know what I'm doing... ✨", es: "Fingiendo que sé lo que hago... ✨" },
    { pt: "Ainda sou mais inteligente que você no Gmail!", en: "Still smarter than you at Gmail!", es: "¡Sigo siendo más inteligente que tú en Gmail!" },
    { pt: "Prometendo não vender seus dados... ou vou? 😈", en: "Promising not to sell your data... or will I? 😈", es: "Prometiendo no vender tus datos... ¿o sí? 😈" },
    { pt: "Sendo mais eficiente que você desde 2024...", en: "Being more efficient than you since 2024...", es: "Siendo más eficiente que tú desde 2024..." },
    { pt: "Julgando suas escolhas de vida via emails...", en: "Judging your life choices via emails...", es: "Juzgando tus decisiones de vida..." },
    { pt: "Aprendendo seus segredos enquanto carrego...", en: "Learning your secrets while loading...", es: "Aprendiendo tus secretos mientras cargo..." },

    // RELACIONAMENTOS/SOCIAL
    { pt: "Achei 3 emails não respondidos da sua mãe... 😬", en: "Found 3 unanswered emails from your mom... 😬", es: "Encontré 3 emails sin responder de tu mamá... 😬" },
    { pt: "Detectei aquela newsletter que você jurou ler...", en: "Found that newsletter you swore you'd read...", es: "Encontré esa newsletter que juraste leer..." },
    { pt: "Vi que você nunca abriu emails do LinkedIn...", en: "Noticed you never open LinkedIn emails...", es: "Vi que nunca abres emails de LinkedIn..." },
    { pt: "Contando emails de 'Precisamos conversar'... 💔", en: "Counting 'We need to talk' emails... 💔", es: "Contando emails de 'Tenemos que hablar'... 💔" },

    // TRABALHO/PRODUTIVIDADE
    { pt: "Analisando quantas reuniões poderiam ser emails...", en: "Analyzing how many meetings could be emails...", es: "Analizando cuántas reuniones podrían ser emails..." },
    { pt: "Encontrei 156 emails com assunto 'Urgente'... nenhum era.", en: "Found 156 'URGENT' emails... none were.", es: "Encontré 156 emails 'URGENTE'... ninguno era." },
    { pt: "Detectei sua técnica de 'marcar como não lido'... 🙄", en: "Detected your 'mark as unread' technique... 🙄", es: "Detecté tu técnica de 'marcar como no leído'... 🙄" },
    { pt: "Calculando quanto tempo você perde com email por dia...", en: "Calculating how much time you waste on email daily...", es: "Calculando cuánto tiempo pierdes con email..." },

    // EXTRAS ABSURDOS
    { pt: "Perguntando aos seus emails o sentido da vida...", en: "Asking your emails the meaning of life...", es: "Preguntando a tus emails el sentido de la vida..." },
    { pt: "Treinando uma IA dentro da IA... inception! 🌀", en: "Training an AI inside the AI... inception! 🌀", es: "Entrenando una IA dentro de la IA... ¡inception! 🌀" },
    { pt: "Meditando sobre a natureza efêmera dos seus dados...", en: "Meditating on the ephemeral nature of your data...", es: "Meditando sobre la naturaleza efímera de tus datos..." },
    { pt: "Filosofando sobre spam e existencialismo...", en: "Philosophizing about spam and existentialism...", es: "Filosofando sobre spam y existencialismo..." },
    { pt: "Fazendo amizade com seus emails abandonados...", en: "Making friends with your abandoned emails...", es: "Haciendo amistad con tus emails abandonados..." },
    { pt: "Organizando uma festa para seus emails não lidos... 🎉", en: "Throwing a party for your unread emails... 🎉", es: "Organizando una fiesta para tus emails no leídos... 🎉" },
];

/**
 * Get a random funny message in the specified language
 */
export function getRandomMessage(lang: 'pt' | 'en' | 'es' = 'pt'): string {
    const idx = Math.floor(Math.random() * funnyMessages.length);
    return funnyMessages[idx][lang];
}

/**
 * Get a different message than the current one
 */
export function getNextMessage(currentMessage: string, lang: 'pt' | 'en' | 'es' = 'pt'): string {
    let newMessage = getRandomMessage(lang);
    let attempts = 0;
    while (newMessage === currentMessage && attempts < 10) {
        newMessage = getRandomMessage(lang);
        attempts++;
    }
    return newMessage;
}
