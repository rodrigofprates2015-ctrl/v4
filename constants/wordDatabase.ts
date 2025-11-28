export const WORD_DATABASE = {
  Animais: [
    'Cachorro',
    'Gato',
    'Elefante',
    'Girafa',
    'Pinguim',
    'Leão',
    'Tubarão',
    'Águia',
    'Cobra',
    'Macaco',
    'Vaca',
    'Cavalo',
  ],
  Lugares: [
    'Praia',
    'Escola',
    'Hospital',
    'Cemitério',
    'Restaurante',
    'Cinema',
    'Supermercado',
    'Banheiro',
    'Biblioteca',
    'Academia',
    'Aeroporto',
    'Prisão',
  ],
  Objetos: [
    'Celular',
    'Escova de Dentes',
    'Garfo',
    'Martelo',
    'Violão',
    'Cama',
    'Espelho',
    'Computador',
    'Relógio',
    'Sapato',
    'Bola',
    'Guarda-Chuva',
  ],
  Comidas: [
    'Pizza',
    'Sushi',
    'Hambúrguer',
    'Sorvete',
    'Chocolate',
    'Ovo',
    'Pão',
    'Macarrão',
    'Salada',
    'Banana',
    'Queijo',
    'Bolo',
  ],
  Profissões: [
    'Médico',
    'Professor',
    'Policial',
    'Bombeiro',
    'Palhaço',
    'Astronauta',
    'Cozinheiro',
    'Motorista',
    'Pintor',
    'Advogado',
  ],
};

export type Category = keyof typeof WORD_DATABASE;

export const getRandomCategory = (): Category => {
  const categories = Object.keys(WORD_DATABASE) as Category[];
  return categories[Math.floor(Math.random() * categories.length)];
};

export const getRandomWord = (category: Category): string => {
  const words = WORD_DATABASE[category];
  return words[Math.floor(Math.random() * words.length)];
};
