Vue.component('VueCart', {
    props: {
        cart: { type: Array, required: true },
        title: { type: String, required: true },
        type: { type: String, required: true }
    },
    computed: {
        totalPrice() {
            let total = 0;
            this.cart.forEach((item) => {
                total += parseFloat(item.price, 10);
            })
            return total.toFixed(2);
        },
        isShoppingCard() {
            return this.type == 'shoppingCart'
        },
        isSavedCard() {
            return this.type == 'savedCart'
        }
    },
    methods: {
        removeFromCart(index) {
            return this.cart.splice(index, 1);
        },
        changeCard(index) {
            const item = this.removeFromCart(index);
            console.log(item);
            this.$emit('itemchangedoncart', item[0], this.type);
            // console.log(this.$emit('itemchangedoncart', item[0], this.type));
        }
    },
    template: `
    <div class="cart-wrapper">
        <h2>{{title}}</h2>
        <p v-if="!cart.length">No item in cart..</p>
        <div class="cart">
            <div class="item" v-for="(item, index) in cart">
                <div class="image">
                    <a v-bind:href="item.url">
                        <img v-bind:src="item.image" />
                    </a>
                </div>
                <div class="info">
                    <h4>{{item.name}}</h4>
                    <p class="seller">by {{item.seller}}</p>
                    <p class="status available" v-if="item.isAvailable">In Stock</p>
                    <p class="shipping" v-if="item.isEligible">Eligible for FREE Shipping & FREE Returns</p>
                    <a href="#" v-on:click="removeFromCart(index)">Delete</a>
                    <a href="#" class="secondary" v-on:click="changeCard(index)" v-if="isShoppingCard">Save for later</a>
                    <a href="#" class="secondary" v-on:click="changeCard(index)" v-if="isSavedCard">Move to cart</a>
                </div>
                <p class="price">\${{item.price}}</p>
            </div>
            <div class="subtotal" v-if="!cart.length==0">
                Subtotal ({{cart.length}} items) <span class="price">\${{totalPrice}}</span>
            </div>
        </div>
    </div>`
})

window.vue = new Vue({
    el: '#app',
    name: 'Cart',
    data: {
        isLoading: true,
        cart: [],
        saved: []
    },
    created() {
        fetch('./data.json')
            .then((res) => { return res.json() })
            .then((res) => {
                this.isLoading = false;
                this.cart = res.cart;
                this.saved = res.saved
            })
    },
    methods: {
        handleItemChange(item, cartType){
            if (cartType==='shoppingCart') {
                this.saved.push(item)
            }
            else{
                this.cart.push(item)
            }
        }
    },
})