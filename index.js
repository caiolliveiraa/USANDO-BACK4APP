Parse.serverURL = 'https://parseapi.back4app.com'; // This is your Server URL
// Remember to inform BOTH the Back4App Application ID AND the JavaScript KEY
Parse.initialize(
  'yAGgQ1Sbpzh6vyoXTB1yAAihG41O1CTrdUbfwTgj', // This is your Application ID
  'WJJBleALGEkeTFfnN1dktNG214K45K1gMFOTRPXJ', // This is your Javascript key
  '8rVn4Rt6sKgMCbCp82kU6BP6uq9eZe0P2IFpJwUk' // This is your Master key (never use it in the frontend)
);

const Tarefa = Parse.Object.extend("Tarefa");

const h3Descricao = document.getElementById("h3Descricao");
const listaTarefas = document.getElementById("listaTarefas");
const inputID = document.getElementById("inputID");
const btPesquisar = document.getElementById("btPesquisar");
const inputDescricao = document.getElementById("inputDescricao");
const btInserir = document.getElementById("btInserir");
const inputNovaDescricao = document.getElementById("inputNovaDescricao");
const btAlterar = document.getElementById("btAlterar");
const btRemover = document.getElementById("btRemover");

const handleClickBtRemover = async () => {
    const id = inputID.value.trim();
    if (!id) {
    alert("Favor digitar um ID");
    return;
}
    const query = new Parse.Query(Tarefa);
    try {
    const tarefa = await query.get(id);
    if (!tarefa) {
        alert("Nenhuma tarefa encontrada!");
        return;
    }
    const response = await tarefa.destroy();
    console.log("Deleted ParseObject", response);
    lerTarefas();
    alert("Objeto removido: " + JSON.stringify(response));
} catch (error) {
    console.error("Error while fetching Tarefa", error);
}
};

const handleClickBtAlterar = async () => {
    const id = inputID.value.trim();
    const novaDescricao = inputNovaDescricao.value.trim();
    if (!id) {
    alert("Favor digitar um ID");
    return;
}
    if (!novaDescricao) {
    alert("Favor digitar uma nova descrição!");
    return;
}
    const query = new Parse.Query(Tarefa);
    try {
    const tarefa = await query.get(id);
    if (!tarefa) {
        alert("Nenhuma tarefa encontrada!");
        return;
    }
    tarefa.set("descricao", novaDescricao);
    tarefa.save();
    lerTarefas();
} catch (error) {
    console.error("Error while fetching Tarefa", error);
}
};

const handleClickBtPesquisar = async () => {
    const id = inputID.value.trim();
    if (!id) {
    alert("Favor digitar um ID");
    return;
}
    const query = new Parse.Query(Tarefa);
    query.equalTo("objectId", id);
    try {
    const tarefa = await query.first();
    if (!tarefa) {
        alert("Nenhuma tarefa encontrada!");
        return;
    }
    const descricao = tarefa.get("descricao");
    const feita = tarefa.get("feita");
    h3Descricao.innerHTML += `${tarefa.id} ${descricao} - ${feita}`;
} catch (error) {
    console.error("Error while fetching Tarefa", error);
}
};

const lerTarefas = async () => {
    const query = new Parse.Query(Tarefa);
    try {
    const results = await query.find();
    listaTarefas.innerHTML = "";
    for (const tarefa of results) {
        const descricao = tarefa.get("descricao");
        const feita = tarefa.get("feita");
        const liTarefa = document.createElement("li");
        const textNode = document.createTextNode(
        `${tarefa.id} ${descricao} - ${feita} `
        );
        liTarefa.appendChild(textNode);
        const btTarefa = document.createElement("button");
        btTarefa.innerHTML = "Exibir";
        btTarefa.onclick = () => exibirTarefa(tarefa);
        liTarefa.appendChild(btTarefa);
        listaTarefas.appendChild(liTarefa);
    }
} catch (error) {
    console.error("Error while fetching Tarefa", error);
}
};

const exibirTarefa = async (tarefa) => {
    alert(
    `Tarefa = ${tarefa.get("descricao")} - ` +
    `feita = ${tarefa.get("feita") ? "sim" : "não"}`
    );
    tarefa.set("feita", !tarefa.get("feita"));
    let result = await tarefa.save();
    console.log("result", result);
    lerTarefas();
};

const inserirTarefa = async () => {
  const descricao = inputDescricao.value.trim();
  if (!descricao) {
    alert("Favor inserir uma descrição!");
    return;
  }
  const tarefa = new Parse.Object("Tarefa");
  tarefa.set("descricao", descricao);
  try {
    const result = await tarefa.save();
    console.log("Tarefa created", result.id);
  } catch (error) {
    console.error("Error while creating Tarefa: ", error);
  }
  inputDescricao.value = "";
  inputDescricao.focus();
  lerTarefas();
};

lerTarefas();

btPesquisar.onclick = handleClickBtPesquisar;
btInserir.onclick = inserirTarefa;
btAlterar.onclick = handleClickBtAlterar;
btRemover.onclick = handleClickBtRemover;