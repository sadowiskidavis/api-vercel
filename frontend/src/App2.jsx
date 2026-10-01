
import { useState } from "react"
import { endereco as buscarEndereco } from "./services/api"

export default function App() {

    const [dadosEndereco, setDadosEndereco] = useState({})
    const [cep, setCep] = useState("")
    const [erro, setErro] = useState("")

    async function buscaCep() {

        try {

            setErro("")

            const data = await buscarEndereco(cep)

            console.log(data)

            setDadosEndereco(data)

        } catch (error) {

            console.error(error)

            setErro(error.message)
        }
    }

    return (
        <>

            <input
                type="text"
                placeholder="Digite seu CEP"
                value={cep}
                onChange={(e) => setCep(e.target.value)}
            />

            <button onClick={buscaCep}>
                Buscar
            </button>

            {erro && (
                <p style={{ color: "red" }}>
                    {erro}
                </p>
            )}

            {dadosEndereco.cep && (
                <div>

                    <h2>Endereço encontrado</h2>

                    <p>
                        <strong>CEP:</strong>{" "}
                        {dadosEndereco.cep}
                    </p>

                    <p>
                        <strong>Logradouro:</strong>{" "}
                        {dadosEndereco.logradouro}
                    </p>

                    <p>
                        <strong>Bairro:</strong>{" "}
                        {dadosEndereco.bairro}
                    </p>

                    <p>
                        <strong>Cidade:</strong>{" "}
                        {dadosEndereco.localidade}
                    </p>

                    <p>
                        <strong>Estado:</strong>{" "}
                        {dadosEndereco.uf}
                    </p>

                </div>
            )}

        </>
    )
}

