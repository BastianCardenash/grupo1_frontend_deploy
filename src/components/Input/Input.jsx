/* eslint-disable react/prop-types */
import './Input.css'
import SearchIcon from '@mui/icons-material/Search';


function Input({ label, text, setText, type, onClick, title, setTitle } ) {

  return (
    <div>
      {type == 'search' ? 
        <div className='search-container'>
          <input className="input-search" type="text" value={text} onChange={(e) => setText(e.target.value)}/>
          <SearchIcon className='search-icon' onClick={() => onClick()}/>
        </div>
      :
      type == 'post' && 
        <div className='post-container'>
          <label className="label-text">{label}</label>
          <input className='normal-input' type='text' value={title} onChange={(e) => setTitle(e.target.value)} placeholder='Ingresar titulo..'/>
          <textarea type="text" className="post-input" value={text} onChange={(e) => setText(e.target.value)} placeholder='Ingresar descripción o detalles..' />
        </div>
      }
    </div>
  )
}

export default Input