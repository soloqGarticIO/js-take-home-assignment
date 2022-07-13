const orderButton = document.querySelector("#btn-order")
const vipButton = document.querySelector("#btn-vip")
const botButton = document.querySelector("#btn-bot")
const dltButton = document.querySelector("#btn-dlt")

const pending = document.querySelector(".pending")
const complete = document.querySelector(".complete")
const botContainer = document.querySelector(".bot")

let orders = []
let bots = []
let completed = []
let orderID = 0
let botID = 0

class Order {
    constructor(id, vip) {
        this.id = id
        this.vip = vip
        this.remaining = vip ? 5:10
    }

    show() {
        return this.vip ? "vip(" + this.id + ")" : "o(" + this.id + ")"
    }
}

class Bot {
    constructor(id) {
        this.id = id
        this.order = null
        this.timer = null
    }


    show() {
        return `b(${this.id}) ${this.order ? `[${this.order.show()}(${(this.order.remaining).toFixed(2)})]` : ''}`;
    }

    process() {
        this.order = orders.shift()

        this.timer = setInterval(() => {
            this.order.remaining-=0.1
            if (this.order.remaining <= 0) {
                completed.push(this.order)
                this.order = null
                clearInterval(this.timer)
            }
        }, 100);
    }

}


const newBot = () => {
    let bot = new Bot(botID++)
    bots.push(bot)
}

const newOrder = () => {
    let order = new Order(orderID++, false)
    orders.push(order)
}

const newVip = () => {
    let vip = new Order(orderID++, true)
    if (orders.length==0) {
        orders.push(vip)
        return
    }

    for (i=0;i<orders.length;i++) {
        if (orders[i].vip == false) {
            orders.splice(i, 0, vip)
            return
        }

        if (i == orders.length-1) {
            orders.push(vip)
            return
        }
    }
}

const deleteBot = () => {
    if (bots.length > 0) {
        lastBot = bots[bots.length-1]
        if (lastBot.order != null) {
            clearInterval(lastBot.timer)
        }
    
        if (lastBot.order == null) {
    
        } else {
            if (lastBot.order.vip == true) {
                orders.unshift(lastBot.order)
            } else {
                let firstNomral = orders.length == 0 ? 0:orders.findIndex((o) => {
                    return o.vip == false
                })
                orders.splice(firstNomral, 0, lastBot.order)
            }
        }
        
        bots.pop()
    }


}

const render = () => {
    botContainer.innerHTML = ""
    pending.innerHTML = ""
    complete.innerHTML = ""

    bots.forEach((b) => {
        let be = document.createElement("p")
        be.innerText = b.show()
        botContainer.appendChild(be)
    })

    orders.forEach((o) => {
        let oe = document.createElement("p")
        oe.innerText = o.show()
        pending.appendChild(oe)
    })

    completed.forEach((c) => {
        let ce = document.createElement("p")
        ce.innerText = c.show()
        complete.appendChild(ce)
    })
}

const processOrder = () => {
    bots.forEach((b) => {
        if (b.order == null && orders.length>0) {
            b.process()
        }
    })
}

botButton.addEventListener("click", newBot)
orderButton.addEventListener("click", newOrder)
vipButton.addEventListener("click", newVip)
dltButton.addEventListener("click", deleteBot)


setInterval(processOrder, 10)
setInterval(render, 10)