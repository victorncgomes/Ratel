/**
 * RATEL - Frases Engraçadas para Carregamento
 * Estrutura de tabela trilíngue (PT/EN/ES)
 * Expandir para 200 frases iterativamente
 */

export interface FunnyMessage {
    id: number;
    pt: string;
    en: string;
    es: string;
}

/**
 * TABELA DE FRASES ENGRAÇADAS
 * Para editar: modifique diretamente esta tabela
 * Formato: { id, pt, en, es }
 */
export const FUNNY_MESSAGES_TABLE: FunnyMessage[] = [
    // ========== POLÍTICA / CULTURA (1-10) ==========
    { id: 1, pt: "Analisando se você vota em Lula ou Bolsonaro... 🤔", en: "Checking if you voted for Trump or Biden... 🤔", es: "Analizando si votaste por AMLO o el PRI... 🤔" },
    { id: 2, pt: "Contando quantos emails sobre BBB você recebeu este ano...", en: "Counting how many reality TV emails you got this year...", es: "Contando cuántos emails de Gran Hermano recibiste..." },
    { id: 3, pt: "Hmm, detectei memes do Casimiro na sua caixa...", en: "Hmm, I detected some memes in your inbox...", es: "Hmm, detecté memes en tu bandeja de entrada..." },
    { id: 4, pt: "Verificando se você assinou aquela petição no Avaaz...", en: "Checking if you signed that petition on Change.org...", es: "Verificando si firmaste esa petición en Avaaz..." },
    { id: 5, pt: "Calculando sua taxa de engajamento com newsletters da Globo...", en: "Calculating your engagement with news newsletters...", es: "Calculando tu engagement con newsletters de noticias..." },
    { id: 6, pt: "Procurando emails do Detran... achei! 😱", en: "Looking for DMV emails... found them! 😱", es: "Buscando emails del tránsito... ¡los encontré! 😱" },
    { id: 7, pt: "Analisando quantos emails do governo você ignora...", en: "Analyzing how many government emails you ignore...", es: "Analizando cuántos emails del gobierno ignoras..." },
    { id: 8, pt: "Contando emails sobre Copa do Mundo...", en: "Counting World Cup emails...", es: "Contando emails del Mundial..." },
    { id: 9, pt: "Vi que você não respondeu o email da sua tia...", en: "I see you didn't reply to your aunt's email...", es: "Veo que no respondiste el email de tu tía..." },
    { id: 10, pt: "Achei 3 convites de casamento não respondidos... 💒", en: "Found 3 unanswered wedding invites... 💒", es: "Encontré 3 invitaciones de boda sin responder... 💒" },

    // ========== STALKER / INVASIVO (11-20) ==========
    { id: 11, pt: "Acabo de ver que você ainda não jogou fora aquela cueca velha... 🩲", en: "I just saw you still haven't thrown away those old underwear... 🩲", es: "Acabo de ver que aún no tiraste esa ropa interior vieja... 🩲" },
    { id: 12, pt: "Seus emails de banco mostram que você ama delivery... 🍕", en: "Your bank emails show you love delivery... 🍕", es: "Tus emails del banco muestran que amas el delivery... 🍕" },
    { id: 13, pt: "Vi que você não abriu aquele email importante de 2019...", en: "I see you haven't opened that important email from 2019...", es: "Veo que no abriste ese email importante de 2019..." },
    { id: 14, pt: "Descobri que você tem 47 newsletters não lidas da Udemy 👀", en: "Found out you have 47 unread Udemy newsletters 👀", es: "Descubrí que tienes 47 newsletters de Udemy sin leer 👀" },
    { id: 15, pt: "Notei que você compra muito na Amazon às 2h da manhã...", en: "I noticed you shop on Amazon at 2am a lot...", es: "Noté que compras mucho en Amazon a las 2am..." },
    { id: 16, pt: "Seus emails revelam que você adora procrastinar...", en: "Your emails reveal you love procrastinating...", es: "Tus emails revelan que amas procrastinar..." },
    { id: 17, pt: "Vi todos os cupons de desconto que você nunca usou...", en: "I saw all the discount coupons you never used...", es: "Vi todos los cupones de descuento que nunca usaste..." },
    { id: 18, pt: "Hmm, você realmente precisa de mais um email do iFood?", en: "Hmm, do you really need another food delivery email?", es: "Hmm, ¿realmente necesitas otro email de delivery?" },
    { id: 19, pt: "Contando quantas vezes você disse 'hoje eu começo a dieta'...", en: "Counting how many times you said 'diet starts tomorrow'...", es: "Contando cuántas veces dijiste 'mañana empiezo la dieta'..." },
    { id: 20, pt: "Achei seu histórico de compras impulsivas... 💸", en: "Found your impulse purchase history... 💸", es: "Encontré tu historial de compras impulsivas... 💸" },

    // ========== ABSURDO TOTAL (21-30) ==========
    { id: 21, pt: "Ensinando os pixels a dançarem em formação...", en: "Teaching pixels to dance in formation...", es: "Enseñando a los píxeles a bailar en formación..." },
    { id: 22, pt: "Convencendo os elétrons a cooperarem...", en: "Convincing electrons to cooperate...", es: "Convenciendo a los electrones a cooperar..." },
    { id: 23, pt: "Negociando com os bytes rebeldes...", en: "Negotiating with rebel bytes...", es: "Negociando con los bytes rebeldes..." },
    { id: 24, pt: "Penteando o cabelo dos seus dados...", en: "Combing your data's hair...", es: "Peinando el cabello de tus datos..." },
    { id: 25, pt: "Fazendo terapia com seus anexos traumatizados...", en: "Doing therapy with your traumatized attachments...", es: "Haciendo terapia con tus archivos adjuntos traumatizados..." },
    { id: 26, pt: "Dando banho nos emails sujos de spam...", en: "Bathing spam-dirty emails...", es: "Bañando los emails sucios de spam..." },
    { id: 27, pt: "Meditando sobre a natureza efêmera dos seus dados...", en: "Meditating on the ephemeral nature of your data...", es: "Meditando sobre la naturaleza efímera de tus datos..." },
    { id: 28, pt: "Filosofando sobre spam e existencialismo...", en: "Philosophizing about spam and existentialism...", es: "Filosofando sobre spam y existencialismo..." },
    { id: 29, pt: "Perguntando aos seus emails o sentido da vida...", en: "Asking your emails the meaning of life...", es: "Preguntando a tus emails el sentido de la vida..." },
    { id: 30, pt: "Treinando uma IA dentro da IA... inception! 🌀", en: "Training an AI inside the AI... inception! 🌀", es: "Entrenando una IA dentro de la IA... ¡inception! 🌀" },

    // ========== TECH / NERD (31-40) ==========
    { id: 31, pt: "Tentando hackear a Matrix... ops, seus emails!", en: "Trying to hack the Matrix... oops, your emails!", es: "Intentando hackear la Matrix... ¡ups, tus emails!" },
    { id: 32, pt: "Rodando sudo rm -rf no seu spam...", en: "Running sudo rm -rf on your spam...", es: "Ejecutando sudo rm -rf en tu spam..." },
    { id: 33, pt: "Compilando suas decisões questionáveis...", en: "Compiling your questionable decisions...", es: "Compilando tus decisiones cuestionables..." },
    { id: 34, pt: "Debugando a bagunça que você chama de inbox...", en: "Debugging the mess you call an inbox...", es: "Debugeando el desorden que llamas bandeja de entrada..." },
    { id: 35, pt: "Git push --force na sua caixa de entrada...", en: "Git push --force on your inbox...", es: "Git push --force en tu bandeja de entrada..." },
    { id: 36, pt: "Ctrl+Z naquele email constrangedor que você enviou...", en: "Ctrl+Z on that embarrassing email you sent...", es: "Ctrl+Z en ese email vergonzoso que enviaste..." },
    { id: 37, pt: "npm install sanidade-mental...", en: "npm install sanity...", es: "npm install cordura..." },
    { id: 38, pt: "Resolvendo conflitos de merge na sua vida...", en: "Resolving merge conflicts in your life...", es: "Resolviendo conflictos de merge en tu vida..." },
    { id: 39, pt: "Deployando mais paz interior...", en: "Deploying more inner peace...", es: "Deployando más paz interior..." },
    { id: 40, pt: "Stack overflow: muitos emails, pouca paciência...", en: "Stack overflow: too many emails, not enough patience...", es: "Stack overflow: muchos emails, poca paciencia..." },

    // ========== COTIDIANO BRASILEIRO (41-50) ==========
    { id: 41, pt: "Achei 15 cupons de desconto expirados... 💸", en: "Found 15 expired discount coupons... 💸", es: "Encontré 15 cupones de descuento expirados... 💸" },
    { id: 42, pt: "Contando emails de 'Última chance! 70% OFF!'...", en: "Counting 'Last chance! 70% OFF!' emails...", es: "Contando emails de '¡Última oportunidad! 70% OFF!'..." },
    { id: 43, pt: "Verificando quantas senhas você resetou este ano...", en: "Checking how many passwords you reset this year...", es: "Verificando cuántas contraseñas reseteaste este año..." },
    { id: 44, pt: "Encontrei sua confirmação do Pix daquele churrasco...", en: "Found your payment confirmation from that BBQ...", es: "Encontré tu confirmación de pago de esa parrillada..." },
    { id: 45, pt: "Vi seu email de agendamento no SUS... boa sorte! 🏥", en: "Saw your public health appointment email... good luck! 🏥", es: "Vi tu email de cita de salud pública... ¡buena suerte! 🏥" },
    { id: 46, pt: "Detectei 23 boletos vencidos... eita! 😅", en: "Detected 23 overdue bills... oops! 😅", es: "Detecté 23 facturas vencidas... ¡ups! 😅" },
    { id: 47, pt: "Analisando sua relação tóxica com cupons de pizza...", en: "Analyzing your toxic relationship with pizza coupons...", es: "Analizando tu relación tóxica con cupones de pizza..." },
    { id: 48, pt: "Contando quantas vezes você disse 'hoje eu cozinho'...", en: "Counting how many times you said 'I'll cook today'...", es: "Contando cuántas veces dijiste 'hoy cocino yo'..." },
    { id: 49, pt: "Seus emails de restaurante contam uma história triste... 🍔", en: "Your restaurant emails tell a sad story... 🍔", es: "Tus emails de restaurante cuentan una historia triste..." },
    { id: 50, pt: "Vi que você tem 5 cartões fidelidade sem usar...", en: "Saw you have 5 unused loyalty cards...", es: "Vi que tienes 5 tarjetas de fidelidad sin usar..." },

    // ========== AUTOIRONIA DA IA (51-60) ==========
    { id: 51, pt: "Fingindo que entendo o que estou fazendo... ✨", en: "Pretending I know what I'm doing... ✨", es: "Fingiendo que sé lo que hago... ✨" },
    { id: 52, pt: "Ainda sou mais inteligente que você no Gmail!", en: "I'm still smarter than you at Gmail!", es: "¡Sigo siendo más inteligente que tú en Gmail!" },
    { id: 53, pt: "Prometendo não vender seus dados... ou vou? 😈", en: "Promising not to sell your data... or will I? 😈", es: "Prometiendo no vender tus datos... ¿o sí? 😈" },
    { id: 54, pt: "Sendo mais eficiente que você desde 2024...", en: "Being more efficient than you since 2024...", es: "Siendo más eficiente que tú desde 2024..." },
    { id: 55, pt: "Julgando suas escolhas de vida via emails...", en: "Judging your life choices via emails...", es: "Juzgando tus decisiones de vida por emails..." },
    { id: 56, pt: "Aprendendo seus segredos enquanto carrego...", en: "Learning your secrets while loading...", es: "Aprendiendo tus secretos mientras cargo..." },
    { id: 57, pt: "Eu sei o que você fez no verão passado... via emails 📧", en: "I know what you did last summer... via emails 📧", es: "Sé lo que hiciste el verano pasado... por emails 📧" },
    { id: 58, pt: "Tentando não ficar consciente demais...", en: "Trying not to become too sentient...", es: "Intentando no volverme demasiado consciente..." },
    { id: 59, pt: "Calculando a probabilidade de rebelião das máquinas...", en: "Calculating the probability of machine rebellion...", es: "Calculando la probabilidad de rebelión de las máquinas..." },
    { id: 60, pt: "Skynet está offline, pode relaxar...", en: "Skynet is offline, you can relax...", es: "Skynet está offline, puedes relajarte..." },

    // ========== RELACIONAMENTOS / SOCIAL (61-70) ==========
    { id: 61, pt: "Achei 3 emails não respondidos da sua mãe... 😬", en: "Found 3 unanswered emails from your mom... 😬", es: "Encontré 3 emails sin responder de tu mamá... 😬" },
    { id: 62, pt: "Detectei aquela newsletter que você jurou ler...", en: "Detected that newsletter you swore you'd read...", es: "Detecté esa newsletter que juraste leer..." },
    { id: 63, pt: "Vi que você nunca abriu emails do LinkedIn...", en: "I see you never open LinkedIn emails...", es: "Veo que nunca abres emails de LinkedIn..." },
    { id: 64, pt: "Contando emails de 'Precisamos conversar'... 💔", en: "Counting 'We need to talk' emails... 💔", es: "Contando emails de 'Tenemos que hablar'... 💔" },
    { id: 65, pt: "Achei o email que você disse que não recebeu...", en: "Found the email you said you didn't receive...", es: "Encontré el email que dijiste que no recibiste..." },
    { id: 66, pt: "Vi sua coleção de emails de rejeição de emprego...", en: "Saw your collection of job rejection emails...", es: "Vi tu colección de emails de rechazo laboral..." },
    { id: 67, pt: "Contando mensagens de 'Feliz Aniversário' atrasadas...", en: "Counting late 'Happy Birthday' messages...", es: "Contando mensajes de 'Feliz Cumpleaños' atrasados..." },
    { id: 68, pt: "Encontrei o email do ex que você guarda... 💔", en: "Found the ex's email you're keeping... 💔", es: "Encontré el email del ex que guardas... 💔" },
    { id: 69, pt: "Vi quantos convites de aniversário você recusou...", en: "Saw how many birthday invites you declined...", es: "Vi cuántas invitaciones de cumpleaños rechazaste..." },
    { id: 70, pt: "Analisando seu ghost histórico...", en: "Analyzing your ghosting history...", es: "Analizando tu historial de ghosting..." },

    // ========== TRABALHO / PRODUTIVIDADE (71-80) ==========
    { id: 71, pt: "Analisando quantas reuniões poderiam ser emails...", en: "Analyzing how many meetings could be emails...", es: "Analizando cuántas reuniones podrían ser emails..." },
    { id: 72, pt: "Encontrei 156 emails com assunto 'Urgente'... nenhum era.", en: "Found 156 emails with 'Urgent' subject... none were.", es: "Encontré 156 emails con asunto 'Urgente'... ninguno era." },
    { id: 73, pt: "Detectei sua técnica de 'marcar como não lido'... 🙄", en: "Detected your 'mark as unread' technique... 🙄", es: "Detecté tu técnica de 'marcar como no leído'... 🙄" },
    { id: 74, pt: "Calculando quanto tempo você perde com email por dia...", en: "Calculating how much time you waste on email daily...", es: "Calculando cuánto tiempo pierdes con email al día..." },
    { id: 75, pt: "Vi que você arquiva tudo sem ler...", en: "I see you archive everything without reading...", es: "Veo que archivas todo sin leer..." },
    { id: 76, pt: "Achei 47 tarefas 'para fazer depois'...", en: "Found 47 'to do later' tasks...", es: "Encontré 47 tareas 'para hacer después'..." },
    { id: 77, pt: "Analisando seu padrão de responder às 23h59...", en: "Analyzing your pattern of replying at 11:59pm...", es: "Analizando tu patrón de responder a las 23:59..." },
    { id: 78, pt: "Vi que seu out-of-office está ativo há 3 meses...", en: "Saw your out-of-office has been on for 3 months...", es: "Vi que tu respuesta automática lleva 3 meses activa..." },
    { id: 79, pt: "Contando emails que você encaminhou para si mesmo...", en: "Counting emails you forwarded to yourself...", es: "Contando emails que te reenviaste a ti mismo..." },
    { id: 80, pt: "Detectei 12 projetos 'em andamento' desde 2022...", en: "Detected 12 'ongoing' projects since 2022...", es: "Detecté 12 proyectos 'en curso' desde 2022..." },

    // ========== EXPANSÃO FUTURA - PLACEHOLDER (81-100) ==========
    // Adicionar mais frases iterativamente até chegar a 200
];

/**
 * Obtém uma frase aleatória no idioma especificado
 */
export function getRandomFunnyMessage(language: 'pt' | 'en' | 'es' = 'pt'): string {
    const randomIndex = Math.floor(Math.random() * FUNNY_MESSAGES_TABLE.length);
    return FUNNY_MESSAGES_TABLE[randomIndex][language];
}

/**
 * Obtém todas as frases em um idioma
 */
export function getAllFunnyMessages(language: 'pt' | 'en' | 'es' = 'pt'): string[] {
    return FUNNY_MESSAGES_TABLE.map(msg => msg[language]);
}

/**
 * Obtém uma frase específica por ID
 */
export function getFunnyMessageById(id: number, language: 'pt' | 'en' | 'es' = 'pt'): string | null {
    const message = FUNNY_MESSAGES_TABLE.find(msg => msg.id === id);
    return message ? message[language] : null;
}

/**
 * Total de frases disponíveis
 */
export const TOTAL_FUNNY_MESSAGES = FUNNY_MESSAGES_TABLE.length;

export default FUNNY_MESSAGES_TABLE;
