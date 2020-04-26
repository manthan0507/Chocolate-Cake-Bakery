//var

const cartBtn = document.querySelector('.cart-button');
const closeCartBtn = document.querySelector('.cart-item-close');
const clearCartBtn = document.querySelector('.clear-cart');
const cartDOM = document.querySelector('.cart');
const cartOverlay = document.querySelector('.cart-overlay');
const cartItems = document.querySelector('.item-count');
const cartTotal = document.querySelector('.item-total');
const cartTotal1 = document.querySelector('.item-total1');
const cartContent = document.querySelector('.cart-area');
const storeDOM = document.querySelector('.store-items');
const btns = document.querySelectorAll('.store-item-icon');
const checkbtn = document.querySelector('.check-out');

//cart items
let cart = [];

//buttons
let buttonDOM = [];
//get store items
class store {

    async getStore() {
        try {
            let result = await fetch('data.json');
            let data = await result.json();
            let storeItems = data.items;
            storeItems = storeItems.map(item => {
                const { title, price } = item.fields;
                const { id } = item.sys;
                const image = item.fields.image.fields.file.url;
                return { title, price, id, image }
            })
            return storeItems;
        } catch (error) {
            console.log(error)
        }
    }

}

// display product
class UI {
    displayStoreItems(storeItems) {
        let result = '';
        storeItems.forEach(storeItems => {

            result += `
            <div class="col-sm-6 col-md-6 col-lg-3 mx-auto my-3 store-item cupcakes " data-item="cupcakes ">
                <div class="card ">
                    <div class="img-container ">
                        <img src=${storeItems.image} alt=" " class="card-img-top store-img ">
                        <button class="store-item-icon " data-id=${storeItems.id}>
                        <i class="fa fa-shopping-cart"></i>
                        Add to cart
                        </button>
                    </div>
                    <div class="card-body ">
                        <div class="card-text d-flex justify-content-between textext t-capitalize ">
                            <h5 id="store-item-name ">${storeItems.title}</h5>
                            <h5 class="store-item-value ">$ <strong id="store-item-price " class="font-weight-bold ">${storeItems.price}</strong></h5>
                        </div>
                    </div>
                </div>
            </div>`;
        });
        storeDOM.innerHTML = result;
    }

    getStoreItems() {
        const buttons = [...document.querySelectorAll('.store-item-icon')];
        buttonDOM = buttons;
        buttons.forEach(button => {
            let id = button.dataset.id;
            let inCart = cart.find(item => item.id === id);
            if (inCart) {
                button.innerText = "Already have";
                button.disabled = true;
            }
            button.addEventListener('click', event => {
                event.target.innerText = "Already Have";
                event.target.disabled = true;
                //get store items from storeItems
                let cartItems = {...storage.getStoreItems(id), amount: 1 };

                //add store item to the cart
                cart = [...cart, cartItems];

                //save cart in local storage
                storage.saveCart(cart);

                //set cart value
                this.setCartValue(cart);
                //display cart item
                this.addCartItems(cartItems);
                //show the cart
                this.showCart();

            });
        });
    }
    setCartValue(cart) {
        let temmpTotal = 0;
        let itemsTotal = 0;
        cart.map(item => {
            temmpTotal += item.price * item.amount;
            itemsTotal += item.amount;
        })
        cartTotal.innerText = parseFloat(temmpTotal.toFixed(2));
        cartTotal1.innerText = parseFloat(temmpTotal.toFixed(2));
        cartItems.innerText = parseInt(itemsTotal);

    }

    addCartItems(item) {
        const div = document.createElement('div');
        div.classList.add('cart-item');
        div.innerHTML = `  <div class=" d-flex justify-content-around text-capitalize my-3 ">
        <img src=${item.image} alt=" " width="150 " class="img-fluid rounded-circle " id="item.img ">
        <div class="item-text align-self-center ">
            <p id="cart-item-title " class="font-weight-bold mb-o item-title ">${item.title}</p>
            <span class="item-title">$</span>
            <span id="cart-item-price " class="cart-item-price mb-0 ">${item.price}</span>
        </div>
        <div>
            <a class="align-self-center ">
                <i class="fa fa-plus my-2 cart-item-add" data-id=${item.id}></i>
            </a>
            <p class="item-count my-2">${item.amount}</p>
            <a class="align-self-center ">
                <i class="fa fa-minus cart-item-remove my-2" data-id=${item.id} ></i>
            </a>
        </div>
        <a class="align-self-center ">
            <i class="fa fa-trash cart-item-clear"  data-id=${item.id}></i>
        </a>
        </div>`;
        cartContent.appendChild(div);
    }
    showCart() {
        cartDOM.classList.add('showCart');

    }

    setupAPP() {
        cart = storage.getCart();
        this.setCartValue(cart);
        this.populate(cart);
        cartBtn.addEventListener('click', this.showCart);
        closeCartBtn.addEventListener('click', this.hideCart);
    }

    hideCart() {

        cartDOM.classList.remove('showCart');

    }
    cartLogic() {
        clearCartBtn.addEventListener("click", () => { this.clearCart() });
        //CART CONTENT
        cartContent.addEventListener("click", event => {
            if (event.target.classList.contains("cart-item-clear")) {

                let removeItem = event.target;
                let id = removeItem.dataset.id;
                cartContent.removeChild(removeItem.parentElement.parentElement.parentElement);
                this.removeItem(id);
            } else if (event.target.classList.contains("cart-item-add")) {
                let addAmount = event.target;
                let id = addAmount.dataset.id;
                let tempItem = cart.find(item => item.id === id);
                tempItem.amount += 1;
                storage.saveCart(cart);
                this.setCartValue(cart);
                addAmount.parentElement.nextElementSibling.innerText = tempItem.amount;
            } else if (event.target.classList.contains("cart-item-remove")) {
                let lowerAmount = event.target;
                let id = lowerAmount.dataset.id;
                let tempItem = cart.find(item => item.id === id);
                tempItem.amount -= 1;
                if (tempItem.amount > 0) {
                    storage.saveCart(cart);
                    this.setCartValue(cart);
                    lowerAmount.parentElement.previousElementSibling.innerText = tempItem.amount;
                } else {
                    cartContent.removeChild(lowerAmount.parentElement.parentElement.parentElement.parentElement);
                    this.removeItem(id);
                }
            }
        });
        checkbtn.addEventListener("click", event => {
            cart = storage.getCart();
            if (cart.length === 0) {
                alert("Cart Is Empty");
            } else {
                this.clearCart();
                alert("Thank you for buy our product")
            }
        });
    }
    clearCart() {
        let cartItems = cart.map(item => item.id);
        cartItems.forEach(id => this.removeItem(id));
        while (cartContent.children.length > 0) {
            cartContent.removeChild(cartContent.children[0]);
        }
        this.hideCart();
    }
    removeItem(id) {
        cart = cart.filter(item => item.id !== id);
        this.setCartValue(cart);
        storage.saveCart(cart);
        let button = this.getSingleButton(id);
        button.disabled = false;
        button.innerHTML = `<i class="fa fa-shopping-cart"></i>
        Add to cart`;
    }

    getSingleButton(id) {
        return buttonDOM.find(button => button.dataset.id === id);
    }
    populate(cart) {
        cart.forEach(item => {
            this.addCartItems(item);
        });
    }

}

//local storage

class storage {

    static saveStoreItems(storeItems) {
        localStorage.setItem("storeItems", JSON.stringify(storeItems));
    }

    static getStoreItems(id) {
        let storeItems = JSON.parse(localStorage.getItem('storeItems'));
        return storeItems.find(storeItems => storeItems.id === id);
    }

    static saveCart(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    static getCart() {
        return localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const ui = new UI();
    const storeItems = new store();
    //set up 
    ui.setupAPP();
    //get store items
    storeItems.getStore().then(storeItems => {
        ui.displayStoreItems(storeItems);
        storage.saveStoreItems(storeItems);
    }).then(() => {
        ui.getStoreItems();
        ui.cartLogic();
    });

});