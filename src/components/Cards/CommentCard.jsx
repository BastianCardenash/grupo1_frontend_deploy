/* eslint-disable react/prop-types */
import DeleteIcon from '@mui/icons-material/Delete';
import './CommentCard.css'

export default function CommentCard ({ commentId, postId, name, description, canDelete, deleteComment}) {

  return (
    <div className='comment-card-container'>
      <div className='comment-card-header'>
        <h2 className='comment-user'>{name}</h2>
        {canDelete && <DeleteIcon className='post-icon' onClick={() => deleteComment(commentId, postId)}/>}
      </div>
      <div className='comment-card-section'>
        <p className='comment-text'>{description}</p>
      </div>
    </div>
  )
}