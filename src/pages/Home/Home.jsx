/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useContext } from 'react'
import Input from '../../components/Input/Input'
import Navbar from '../../components/Navbar/Navbar'
import './Home.css'
import Button from '../../components/Button/Button';
import axios from 'axios';
import { AuthContext } from '../../auth/AuthContext'
import PostCard from '../../components/Cards/PostCard'
import CommentCard from '../../components/Cards/CommentCard';
import CloseIcon from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog'

function Home() {
  const { token, parseJwt } = useContext(AuthContext);
  const [postText, setPostText] = useState('')
  const [posts, setPosts] = useState([])
  const [msg, setMsg] = useState('')
  const [deleteMsg, setDeleteMsg] = useState('')
  const [postTitle, setPostTitle] = useState('')
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState([])
  const [commentMsg, setCommentMsg] = useState('')
  const [actualPostComments, setActualPostComments] = useState('')
  const [deleteCommentMsg, setDeleteCommentMsg] = useState('')
  const [usersStatus, setUsersStatus] = useState([])
  const [openedModal, setOpenedModal] = useState(false)
  const [newStatus, setNewStatus] = useState('')
  const [accessDenied, setAccessDenied] = useState(false)
  const [actualUserId, setActualUserId] = useState(0)

  const api = axios.create({ baseURL: import.meta.env.VITE_BACKEND_URL })
  api.interceptors.request.use((config) => (config.headers.Authorization = `Bearer ${token}`, config))

  const handlePost = async () => {
    if (postText != '' && postTitle != '') {
      try {
        await api.post('/posts', {
          user_id: actualUserId,
          title: postTitle,
          description: postText
        })
        setPostText('')
        setPostTitle('')
        setMsg('')
        getPosts()
      } catch (error) {
        console.error('Ocurrio un error al hacer el post:', error)
      }
    }
    else {
      setMsg('Tienes que rellenar los campos para hacer un post.')
    }
  }

  const getPosts = async () => {
    try {
      const response = await api.get('/posts')
      const userPromises = response.data.map(async (post) => {
        const user = await api.get(`/users/${post.user_id}`)
        return {
          id: post.id,
          userName: user.data.name,
          user_id: post.user_id,
          title: post.title,
          text: post.description,
          fecha: post.createdAt
        }
      })

      const postsWithUserNames = await Promise.all(userPromises)

      setPosts([...postsWithUserNames].reverse())
    } catch (error) {
      console.error('Ocurrio un error al cargar los posts:', error);
    }
  };

  const deletePost = async (postId) => {
    try {
      const confirmation = window.confirm('¿Seguro que quieres eliminar el post?')
      if (confirmation) {
        await api.delete(`/posts/${postId}`)
        setDeleteMsg('El post se ha eliminado correctamente')
        getPosts()
        setShowComments(false)

        setTimeout(() => {
          setDeleteMsg('')
        }, 3000)
      }
    } catch(error){
      console.error('Ocurrio un error al eliminar el post:', error);
    }
  }

  const handlePostComment = async (postId, comment) => {
    if (comment != '') {
      try {
        await api.post('/comments', {
          user_id: actualUserId,
          post_id: postId,
          description: comment
        })
        setCommentMsg('')
        setShowComments(true)
        triggerComments(postId)
      } catch (error) {
        console.error('Ocurrio un error al crear un comentario:', error)
      }
    }
    else {
      setCommentMsg('Tienes que escribir algo para comentar')
    }
  }

  const triggerComments = async (postId) => {
    try {
      const response = await api.get(`/comments/${postId}`)
      const post = await api.get(`/posts/${postId}`)
      setActualPostComments(post.data.title)
      const commentPromises = response.data.map(async (comment) => {
        const user = await api.get(`/users/${comment.user_id}`)
        return {
          id: comment.id,
          userName: user.data.name,
          user_id: comment.user_id,
          post_id: comment.post_id,
          description: comment.description
        }
      })

      const commentsWithUserAndPost = await Promise.all(commentPromises)

      setComments([...commentsWithUserAndPost].reverse())
      setShowComments(true)
    } catch (error) {
      console.error('Ocurrio un error al mostrar los comentarios', error)
    }
  }

  const deleteComment = async (commentId, postId) => {
    try {
      const confirmation = window.confirm('¿Seguro que quieres eliminar el comentario?')
      if (confirmation) {
        await api.delete(`/comments/${commentId}`)
        setDeleteCommentMsg('El comentario se ha eliminado correctamente')
        triggerComments(postId)

        setTimeout(() => {
          setDeleteCommentMsg('')
        }, 3000)
      }
    } catch(error){
      console.error('Ocurrio un error al eliminar el comentario:', error);
    }
  }

  const handleUsersStatus = async (userId) => {
    try {
      const response = await api.get('/users')
      const user = await api.get(`/users/${userId}`)
      const usersFriends = response.data.filter(elem => user.data.friendsIds.includes(elem.id))
      setUsersStatus(usersFriends.reverse().slice(0, 3))
    } catch (error) {
      console.error('Ocurrio un error al mostrar los estados de usuarios:', error);
    }
  }

  const editUserStatus = async () => {
    try {
      await api.patch(`/users/${actualUserId}`, {
        status: newStatus
      })
      setOpenedModal(false)
      setNewStatus('')
    } catch (error) {
      console.error('Ocurrio un error al editar el estado:', error);
    }
  }

  useEffect(() => {
    if (token != 'null') {
      setActualUserId(parseJwt(token).sub)
      getPosts()
      handleUsersStatus(parseJwt(token).sub)
      const tokenExpired = token && parseJwt(token).exp < Date.now() / 1000;
      if (tokenExpired) {
        setAccessDenied(true)
      }
    }
    else {
      setAccessDenied(true)
    }
  }, [token])

  const isAdmin = () => {
    const scope = parseJwt(token).scope;
    if (scope.includes('admin')) {
      return true;
    } else {
      return false;
    }
  }

  if (accessDenied) {
    return (
      <>
        <h1 className='unauthorized-message'>No tienes autorización para ver esta página</h1>
        <button className='unauthorized-button' onClick={() => window.location.href = '/login'}>Inicia sesión</button>
      </>
    )
  } else {
    return (
      <div className='home-page-container'>
        <Navbar />
        <div className='home-users-status-container'>
          <h2 className='subtitle'>Actividad de tus amigos:</h2>
          {usersStatus.map((user, index) => (
            <div key={index} className='user-status-container'>
              <div className='user-status-section'>
                <h4 className='user-name'>{user.name}</h4>
                {user.status == '' || user.status == null
                  ? <p className='user-status'>N/A</p>
                  : <p className='user-status'>{user.status}</p>
                }
              </div>
              <div className='line'></div>
            </div>
          ))}
          <button className='edit-status-button' onClick={() => setOpenedModal(true)}>Cambiar estado</button>
        </div>
        <Dialog
          open={openedModal}
          onClose={() => setOpenedModal(false)}
        >
          <p className='dialog-text'>Ingrese el nuevo estado deseado:</p>
          <textarea type="text" className="edit-status" value={newStatus} onChange={(e) => setNewStatus(e.target.value)}/>
          <button className='edit-status-button' onClick={() => editUserStatus(true)}>Confirmar</button>
        </Dialog>
        <div className='home-page-info-container'>
          <div className='home-column'>
            <h2 className='subtitle'>Publicaciones:</h2>
            <div className='post-section'>
              <div className='post-column'>
                <Input type='post' label='Que quieres publicar:' text={postText} title={postTitle} setTitle={setPostTitle} setText={setPostText}/>
                {msg.length > 0 && <div className="alert alert-danger"> {msg} </div>}
                <div className='buttons-post-section'>
                  <Button text='Publicar' type='submit' onClick={(e) => handlePost(e.target.value)}/>
                </div>
              </div>
              <div className='post-column'>
                <label className="label-text">Publicaciones recientes:</label>
                {deleteMsg.length > 0 && <div className="alert alert-success"> {deleteMsg} </div>}
                {commentMsg.length > 0 && <div className="alert alert-danger"> {commentMsg} </div>}
                {posts.length > 0 &&
                  posts.map((post, index) => (
                    <div key={index}>
                      <PostCard
                        deletePost={deletePost}
                        getPosts={getPosts}
                        postId={post.id}
                        name={post.userName}
                        title={post.title}
                        description={post.text}
                        canDelete={post.user_id ==  actualUserId || isAdmin()}
                        postComment={handlePostComment}
                        openComments={triggerComments}
                      />
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
          {/* {showComments && <div className='line'></div>} */}
          {showComments &&
            <div className='home-column'>
              <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '12rem'}}>
                <h2 className='subtitle'>Comentarios:</h2>
                <CloseIcon style={{color: '#485FC7', cursor: 'pointer'}} onClick={() => setShowComments(false)}/>
              </div>
              <div className='post-column'>
                <label className="label-text">{`Post: ${actualPostComments}`}</label>
                {deleteCommentMsg.length > 0 && <div className="alert alert-success"> {deleteCommentMsg} </div>}
                {comments.map((comment, index) => (
                  <div key={index}>
                    <CommentCard
                      name={comment.userName}
                      commentId={comment.id}
                      description={comment.description}
                      canDelete={comment.user_id ==  actualUserId || isAdmin()}
                      deleteComment={deleteComment}
                      postId={comment.post_id}
                    />
                  </div>
                ))}
              </div>
            </div>
          }
        </div>
      </div>
    )
  }


}

export default Home