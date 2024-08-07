import {useModal} from '../../context/Modal';
import './OpenModalButton.css'
function OpenModalButton({
    modalComponent,
    buttonText,
    onButtonClick,
    onModalClose
}){
    const {setModalContent,setOnModalClose} = useModal();

    const onClick = () => {
        if(onModalClose) setOnModalClose(onModalClose);
        setModalContent(modalComponent);
        if(typeof onButtonClick === 'function') onButtonClick();
    };
    return <button onClick={onClick} id='button'>{buttonText}</button>
}

export default OpenModalButton;