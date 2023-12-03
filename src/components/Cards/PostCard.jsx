/* eslint-disable react/prop-types */
import { useState, useContext } from 'react'
import DeleteIcon from '@mui/icons-material/Delete';
import EditNoteIcon from '@mui/icons-material/EditNote';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import './PostCard.css'
import axios from 'axios';
import { AuthContext } from '../../auth/AuthContext'

export default function PostCard ({ postId, name, title, description, canDelete, deletePost, getPosts, postComment, openComments }) {
  const { token } = useContext(AuthContext)
  const [comment, setComment] = useState('')
  const [edit, setEdit] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newText, setNewText] = useState('')
  const [msg, setMsg] = useState('')

  const api = axios.create({ baseURL: import.meta.env.VITE_BACKEND_URL })
  api.interceptors.request.use((config) => (config.headers.Authorization = `Bearer ${token}`, config))

  const handleEdit = () => {
    setNewText(description)
    setNewTitle(title)
    setEdit(true)
  }

  const editPost = async () => {
    if (newText != '' && newTitle != '') {
      try {
        await api.patch(`/posts/${postId}`, {
          title: newTitle,
          description: newText
        })
        setMsg('')
        getPosts()
        setEdit(false)
      } catch (error) {
        console.error('Ocurrio un error al editar el post:', error)
      }
    }
    else {
      setMsg('No puedes dejar alguno de los campos vacio.')
    }
  }

  const cancelEdit = () => {
    setEdit(false)
    setMsg('')
  }

  const handleComment = () => {
    postComment(postId, comment)
    setComment('')
  }
  
  return (
    <div className='post-card-container'>
      <div className='post-card-header'>
        <h2 className='post-user'>{name}</h2>
        {canDelete && <EditNoteIcon className='post-icon' onClick={() => handleEdit()}/>}
        {canDelete && <DeleteIcon className='post-icon' onClick={() => deletePost(postId)}/>}
      </div>
      {edit ? 
      <>
        <div className='post-card-section'>
          <input className='edit-title' type='text' value={newTitle} onChange={(e) => setNewTitle(e.target.value)}/>
          <textarea type="text" className="edit-text" value={newText} onChange={(e) => setNewText(e.target.value)}/>
        </div>
        <div className='comment-section'>
          <button className='comment-post-button' onClick={() => cancelEdit()}>Cancelar</button>
          <button className='comment-post-button' onClick={() => editPost()}>Confirmar</button>
        </div>
        {msg.length > 0 && <div className="alert alert-danger"> {msg} </div>}
      </>
      :
      <>
        <div className='post-card-section'>
          <h3 className='post-title'>{title}</h3>
          <p className='post-text'>{description}</p>
        </div>
        <div className='comment-section'>
          <input type='text' className='comment-post' value={comment} onChange={(e) => setComment(e.target.value)}/>
          <button className='comment-post-button' onClick={() => handleComment()}>Comentar</button>
          <KeyboardArrowDownIcon className='comment-icon' onClick={() => openComments(postId)}/>
        </div>
      </>
      }
    </div>
  )
}