import axios from 'axios';
import api from '../api/Api';
import { useEffect, useState } from 'react';
import Modal from "../components/Modal";
import Message from '../components/Message';
import { ImItalic } from 'react-icons/im';

function Products() {
    const [bbtn,setbbtn] = useState();
    const [products, setProducts] = useState([]);
    useEffect(() => {
        api.get('/products')
            .then(response => {
                setProducts(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the products!', error);
            });
    }, []);

    const [modalOpen, setModalOpen] = useState(false);

    const handleSabmit = (event) =>{
        event.preventDefault()
        setModalOpen(false)
        Msg("Siz bizning 1000-foydalanuvchimiz bo'lganiz uchun bu mahsulotni sizga tekinga beramiz. Aslida hali to'lov usullaridan foydalanishni bilmayman shu uchun bu mahsulot siz uchun tekin :] ","white",30000)
        api.get(`/products/add/${bbtn}`)
        .then(response => {
            console.log(response.data)
        }).catch(error =>{
            console.log(error)
        })

    };

    // message 
    const [isMessage, setIsMessage] = useState(false)
    const [message, setMessage] = useState({})
    function Msg(xabar,color,vaqt){
        setMessage({
        text: xabar,
        color: color,
        })
        setIsMessage(true);
        setTimeout(() => {
            setIsMessage(false)
        }, vaqt)
    }

    // buy button
    const BuyBtn = (p_id) => {
        setModalOpen(!modalOpen);
        if (p_id){
            setbbtn(p_id);
        }
    }

    return (
        <div className='products-page'>
            <h1>Mahsulotlar</h1>
            <div className='products'>
                {products.length === 0 && <h3 style={{fontStyle:"italic",opacity:"50%"}}>Mahsulotlar mavjud emas</h3>}
                {products && products.map((product) => (
                    <div className='product' key={product.id}>
                        <h2>{product.product_name}</h2>
                        <button className='buyBtn' onClick={() => {BuyBtn(product.id)}}><p>${product.price}</p></button>
                    </div>
                ))}
        
            </div>
            {modalOpen && <Modal isOpen={true} onClose={() => {BuyBtn()}}>
                <form onSubmit={handleSabmit}>
                    <h2>Karta ma'lumotlarini kiriting</h2>
                    <input type="text" inputMode='numeric' maxLength={16} placeholder='Karta raqami' style={{padding:"0.5rem 2rem",borderRadius:"0.3rem" , width:'80%'}} required/>
                    <div style={{marginTop:"1rem",display:"flex",justifyContent:"space-around"}}>
                        <input type="text" placeholder="MM/YY" inputMode="numeric" required style={{width:"3rem",padding:"0.5rem 2rem"}} />
                        <input type="text" placeholder="CVC" maxLength={3} inputMode="numeric" required style={{width:"3rem",padding:"0.5rem 2rem"}} />

                    </div>
                    <button style={{width:"100%",marginTop:"1rem"}}>Sotib olish</button>
                </form>
            </Modal>}
            <Message message={message} isMessage={isMessage} setIsMessage={setIsMessage} />
        </div>
    );
}
export default Products;