import { useEffect, useState } from "react"
import AuthForm from "./components/AuthForm"
import PostForm from "./components/PostForm"
import PostList from "./components/PostList"
import { endereco, listarPosts } from "./services/api"

export default function App() {

    const [posts, setPosts] = useState([])
    const [usuario, setUsuario] = useState(null)
    const [token, setToken] = useState(null)
    const [endereco, setEndereco] = useState({})
    const [cep, setCep] = useState("")

    const [postEmEdicao, setPostEmEdicao] = useState(null)
    const [erro, setErro] = useState("")


    // Quando a aplicação abre, recuperamos os dados salvos
    // no navegador.
    

    // Carrega os posts quando a aplicação inicia.
   


    async function carregarPosts() {

        try {

            setErro("")

            const data = await listarPosts()

            setPosts(data)

        } catch (error) {

            setErro(error.message)
        }
    }


    function handleLogin(user, jwtToken) {

        setUsuario(user)
        setToken(jwtToken)

        // Guardamos o token e o usuário no navegador.
        localStorage.setItem("token", jwtToken)
        localStorage.setItem("usuario", JSON.stringify(user))
    }


    function handleLogout() {

        setUsuario(null)
        setToken(null)
        setPostEmEdicao(null)

        localStorage.removeItem("token")
        localStorage.removeItem("usuario")
    }


    async function handlePostSalvo() {

        setPostEmEdicao(null)

        await carregarPosts()
    }
     
    async function buscaCep(cep){
        try{
            const data = await endereco(cep)
            setEndereco(data)
        }


        catch(error){
            setErro(error.message)
        }
    }



    return (
        <>

            <header className="topbar">

                <div>
                    <h1>React + Fetch</h1>
                    <p>Frontend consumindo a API de posts</p>
                </div>

                {usuario && (
                    <div className="user-area">

                        <span>
                            Olá, <strong>{usuario.name}</strong>
                        </span>

                        <button
                            className="secondary"
                            onClick={handleLogout}
                        >
                            Sair
                        </button>

                    </div>
                )}

            </header>


            <main className="container">

                {!usuario && (
                    <AuthForm onLogin={handleLogin} />
                )}


                {usuario && (
                    <PostForm
                        token={token}
                        postEmEdicao={postEmEdicao}
                        onSalvo={handlePostSalvo}
                        onCancelar={() => setPostEmEdicao(null)}
                    />
                )}


                <div className="section-title">

                    <div>
                        <h2>Posts</h2>
                        <p>Todos os posts cadastrados no backend.</p>
                    </div>

                    <button
                        className="secondary"
                        onClick={carregarPosts}
                    >
                        Atualizar
                    </button>

                </div>


                {erro && (
                    <p className="message error">
                        {erro}
                    </p>
                )}


                <PostList
                    posts={posts}
                    usuario={usuario}
                    token={token}
                    onEditar={setPostEmEdicao}
                    onExcluido={carregarPosts}
                />

            </main>

            <input type="text" placehoder="digite seu cep" value={cep}onChange={(e)=> setCep(e.target.value)} /> 
            <button onClick={buscaCep(cep)}>Buscar</button>     
        </>
    )

}
