class RecintosZoo {
  constructor() {
    // Definição dos recintos disponíveis no zoológico
    this.recintos = [
      {
        numero: 1,
        bioma: "savana",
        tamanhoTotal: 10,
        animais: [{ especie: "MACACO", quantidade: 3, tipo: "herbivoro" }],
      },
      { numero: 2, bioma: "floresta", tamanhoTotal: 5, animais: [] },
      {
        numero: 3,
        bioma: "savana e rio",
        tamanhoTotal: 7,
        animais: [{ especie: "GAZELA", quantidade: 1, tipo: "herbivoro" }],
      },
      { numero: 4, bioma: "rio", tamanhoTotal: 8, animais: [] },
      {
        numero: 5,
        bioma: "savana",
        tamanhoTotal: 9,
        animais: [{ especie: "LEAO", quantidade: 1, tipo: "carnivoro" }],
      },
    ];

    // Definição das características de cada animal
    this.animais = {
      LEAO: { tamanho: 3, biomas: ["savana"], tipo: "carnivoro" },
      LEOPARDO: { tamanho: 2, biomas: ["savana"], tipo: "carnivoro" },
      CROCODILO: { tamanho: 3, biomas: ["rio"], tipo: "carnivoro" },
      MACACO: { tamanho: 1, biomas: ["savana", "floresta"], tipo: "herbivoro" },
      GAZELA: { tamanho: 2, biomas: ["savana"], tipo: "herbivoro" },
      HIPOPOTAMO: { tamanho: 4, biomas: ["savana", "rio"], tipo: "herbivoro" },
    };
  }

  // Função para analisar os recintos e determinar onde um animal pode ser colocado
  analisaRecintos(animal, quantidade) {
    // Verificando se o animal é válido
    if (!this.animais[animal]) {
      return { erro: "Animal inválido" };
    }

    // Validação da quantidade fornecida
    if (quantidade <= 0) {
      return { erro: "Quantidade inválida" };
    }

    const dadosAnimal = this.animais[animal];
    const tamanhoNecessario = dadosAnimal.tamanho * quantidade;
    let recintosViaveis = [];

    // Iteração por todos os recintos para verificar se são adequados
    this.recintos.forEach((recinto) => {
      const animaisNoRecinto = recinto.animais;
      let espacoOcupado = 0;
      const biomaValido = dadosAnimal.biomas.some((bioma) =>
        recinto.bioma.includes(bioma)
      );
      let convivioPossivel = true;

      // Se o bioma do recinto não for compatível, passa para o próximo
      if (!biomaValido) return;

      // Cálculo do espaço ocupado no recinto e verificação da convivência
      animaisNoRecinto.forEach((animalRecinto) => {
        const infoAnimalRecinto = this.animais[animalRecinto.especie];
        espacoOcupado += infoAnimalRecinto.tamanho * animalRecinto.quantidade;

        // Os carnívoros só podem conviver com a mesma espécie
        if (
          infoAnimalRecinto.tipo === "carnivoro" &&
          infoAnimalRecinto.especie !== animal
        ) {
          convivioPossivel = false;
        }

        // Se o animal que estamos tentando alocar for carnívoro, ele não pode conviver com outras espécies
        if (
          dadosAnimal.tipo === "carnivoro" &&
          animalRecinto.especie !== animal
        ) {
          convivioPossivel = false;
        }
      });

      // Verificação específica para o hipopótamo: precisa de "savana e rio"
      if (
        animal === "HIPOPOTAMO" &&
        recinto.bioma !== "savana e rio" &&
        animaisNoRecinto.length > 0
      ) {
        convivioPossivel = false;
      }

      // Cálculo do espaço disponível no recinto
      let espacoDisponivel = recinto.tamanhoTotal - espacoOcupado;

      // Se já houver outra espécie no recinto, o espaço disponível diminui devido ao espaço de convivência
      if (
        animaisNoRecinto.length > 0 &&
        animaisNoRecinto[0].especie !== animal
      ) {
        espacoDisponivel -= 1;
      }

      // Se há espaço suficiente e convivência viável, adiciona o recinto à lista de opções
      if (espacoDisponivel >= tamanhoNecessario && convivioPossivel) {
        recintosViaveis.push(
          `Recinto ${recinto.numero} (espaço livre: ${
            espacoDisponivel - tamanhoNecessario
          } total: ${recinto.tamanhoTotal})`
        );
      }
    });

    // Se encontrou recintos viáveis, retorna a lista; caso contrário, retorna uma mensagem de erro
    if (recintosViaveis.length > 0) {
      return { recintosViaveis };
    } else {
      return { erro: "Não há recinto viável" };
    }
  }
}

// Exemplo de uso da classe
const zoo = new RecintosZoo();
const resultado = zoo.analisaRecintos("MACACO", 2);
console.log(resultado);

export { RecintosZoo as RecintosZoo };
