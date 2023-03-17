let eventBus = new Vue()


Vue.component('cols', {
    template:`
    <div id="cols">
        <createcard></createcard>
        <div class="column">
            <col1 :column1="column1"></col1>
            <col2 :column2="column2"></col2>
            <col3 :column3="column3"></col3>
            <col4 :column4="column4"></col4>
        </div>
    </div>
`,
    data() {
        return {
            column1: [],
            column2: [],
            column3: [],
            column4: [],
        }
    },
    methods: {
        saveColumn1(){
            localStorage.setItem('column1', JSON.stringify(this.column1));
        },
        saveColumn2(){
            localStorage.setItem('column2', JSON.stringify(this.column2));
        },
        saveColumn3(){
            localStorage.setItem('column3', JSON.stringify(this.column3));
        },
        saveColumn4(){
            localStorage.setItem('column4', JSON.stringify(this.column4));
        },
    },
    updated(){
        this.saveColumn1()
        this.saveColumn2()
        this.saveColumn3()
        this.saveColumn4()
    },

    mounted() {
        this.column1 = JSON.parse(localStorage.getItem("column1")) || [];
        this.column2 = JSON.parse(localStorage.getItem("column2")) || [];
        this.column3 = JSON.parse(localStorage.getItem("column3")) || [];
        this.column4 = JSON.parse(localStorage.getItem("column4")) || [];
        eventBus.$on('addColumn1', card => {
            this.column1.push(card)
            this.saveColumn1()
        })
        eventBus.$on('addColumn2', card => {
            this.column2.push(card)
            this.saveColumn2()
        })
        eventBus.$on('addColumn3', card => {
            this.column3.push(card)
            this.saveColumn3()
        })
        eventBus.$on('addColumn4', card => {
            this.column4.push(card)
            if (card.date > card.finishdate) {
                card.current = false
            }
            this.saveColumn4()
        })
    },
    computed: {

    }
})

Vue.component('col4', {
    template: `
        <div class="col">
            <h2>Выполненные задачи</h2>
            <li v-for="card in column4">
                <p>{{card.title}}</p>
                <ul>
                    <li><b>Задача:</b> {{card.description}}</li>
                    <li><b>Дата создания:</b>{{ card.date }}</li>
                    <li><b>Дэдлайн:</b> {{card.finishdate}}</li>
                    
                    <li class="tasks1" v-if="card.current"> Выполнено вовремя</li>
                    <li class="tasks2" v-else>Выполнено не вовремя</li>
                </ul>
            </li>
        </div>
    `,
    props: {
        column4: {
            type: Array,
        },
        card: {
            type: Object
        }
    },
})


Vue.component('col3', {
    template: `
        <div class="col"> 
            <h2>Тестирование</h2>
            <li v-for="card in column3" >
                <p>{{card.title}}</p>
                <ul>
                    <li class="tasks"><b>Задача: </b>{{card.description}}</li>
                    <li class="tasks"><b>Дата создания:</b>{{ card.date }}</li>
                    <li class="tasks"><b>Дэдлайн:</b> {{card.finishdate}}</li>
                    <li class="tasks" v-if="card.reason != null" v-for="t in card.reason"><b>Причина возврата:</b>{{ t }}</li>
                    <li class="tasks" v-if="card.edit != null"><b>Последнее изменение:</b> {{ card.edit}}</li>
                    <li class="tasks" v-if="card.editB">
                        <form @submit.prevent="updateCard(card)">
                            <p>Новое название: 
                                <input type="text" v-model="card.title" maxlength="30">
                            </p>
                            <p>Новая задача: 
                                <textarea v-model="card.description" cols="20" rows="5"></textarea>
                            </p>
                            <p>
                                <input type="submit" value="Изменить">
                            </p>
                        </form>
                    </li>
                    <li class="tasks" v-if="card.transfer">
                        <form @submit.prevent="lastcol(card)">
                            <p><b>Причина возврата:</b>
                                <input type="text" v-model="reason">
                            </p>
                            <p>
                                <input type="submit" value="OK">
                            </p>
                        </form>
                    </li>
                </ul>
                <div class="change2">
                <a @click="card.transfer = true">&#9668;</a> <a @click="card.editB = true">&#9998;</a> <a @click="nextcol(card)">&#9658;</a></div>
                </li>
            </div>
        </div>
    `,
    props: {
        column3: {
            type: Array,
        },
        card: {
            type: Object
        }
    },
    methods: {
        nextcol(card) {
            this.column3.splice(this.column3.indexOf(card), 1)
            eventBus.$emit('addColumn4', card)
        },
        lastcol(card) {
            card.transfer = false
            this.column3.splice(this.column3.indexOf(card), 1)
            card.reason.push(this.reason)
            eventBus.$emit('addColumn2', card)
            this.reason=''
        },
        updateCard(card){
            card.edit = new Date().toLocaleString()
            card.editB = false
            this.column3.push(card)
            this.column3.splice(this.column3.indexOf(card), 1)
        }
    },
    data(){
        return{
            reason:[],
        }
    }
})

Vue.component('col2', {
    template: `
        <div class="col">
            <h2>Задачи в работе</h2>
            <li v-for="card in column2">
                <p>{{card.title}}</p>
                <ul>
                    <li><b>Задача:</b> {{card.description}}</li>
                    <li><b>Дата создания:</b> {{ card.date }}</li>
                    <li><b>Дэдлайн:</b> {{card.finishdate}}</li>
                    <li v-if="card.reason != null" v-for="t in card.reason"><b>Причина возврата:</b>{{t}}</li>
                    <li v-if="card.edit != null"><b>Последнее изменение:</b> {{ card.edit}}</li>
                    <li v-if="card.editB">
                        <form @submit.prevent="updateCard(card)">
                            <p>Новое название: 
                                <input type="text" v-model="card.title" maxlength="30">
                            </p>
                            <p>Новая задача: 
                                <textarea v-model="card.description" cols="20" rows="5"></textarea>
                            </p>
                            <p>
                                <input type="submit" value="OK">
                            </p>
                        </form>
                    </li>
                </ul>
                <div class="change1">
                    <a @click="card.editB = true" >&#9998;</a> <br>
                    <a @click="nextcol(card)">&#9658;</a>
                </div>
                </li>
        </div>
    `,
    props: {
        column2: {
            type: Array,
        },
        card: {
            type: Object
        }
    },
    methods: {
        nextcol(card) {
            this.column2.splice(this.column2.indexOf(card), 1)
            eventBus.$emit('addColumn3', card)
        },
        updateCard(card){
            card.edit = new Date().toLocaleString()
            card.editB = false
            this.column2.push(card)
            this.column2.splice(this.column2.indexOf(card), 1)
        }
    }
})

Vue.component('col1', {
    template: `
        <div class="col">
            <h2>Запланированные задачи</h2>
            <li v-for="card in column1">
                
                <p>{{card.title}}</p>
                <ul>
                    <p><b>Задание:</b> {{card.description}}</p>
                    <li ><b>Дата создания:</b> {{ card.date }}</li>
                    <li ><b>Дэдлайн:</b> {{card.finishdate}}</li>
                    <li v-if="card.edit != null"><b>Последнее изменение:</b>{{ card.edit}}</li>
                    <li v-if="card.editB">
                        <form @submit.prevent="updateCard(card)">
                            <p>Новое название: 
                                <input type="text" v-model="card.title" maxlength="30">
                            </p>
                            <p>Новая задача: 
                                <textarea v-model="card.description" cols="20" rows="5"></textarea>
                            </p>
                            <p>
                                <input type="submit" value="OK">
                            </p>
                        </form>
                    </li>
                </ul>
                <div class="change"><a @click="deleteCard(card)">&#10006;</a>   <a @click="card.editB = true">&#9998;</a> <a @click="nextcol(card)">&#9658;</a></div>
               </li>
            </div>
        </div>
    `,
    props: {
        column1: {
            type: Array,
        },
        column2: {
            type: Array,
        },
        card: {
            type: Object
        },
        errors: {
            type: Array
        }
    },
    methods: {
        nextcol(card){
            this.column1.splice(this.column1.indexOf(card),1)
            eventBus.$emit('addColumn2', card)
        },
        deleteCard(card) {
            this.column1.splice(this.column1.indexOf(card), 1)
        },
        updateCard(card){
            card.editB = false
            this.column1.push(card)
            this.column1.splice(this.column1.indexOf(card), 1)
            card.edit = new Date().toLocaleString()
        }
    },
})

Vue.component('createcard',{
    template:`
<section>
   <div class="btn"><a href="#openModal" class="btnModal">Создать задачу</a></div> 
    <div id="openModal" class="modal">
       <div class="modal-body">    
       <div class="form">
       <a href="#close" title="Close" class="close">&#10006;</a>
         <h2>Создание задачи</h2>
        <form @submit.prevent="onSubmit">
            <label for="title">Заголовок</label>
            <input id="title" v-model="title" type="text" required maxlength="30">
            <label for="description">Задача</label><br>
            <textarea id="description" v-model="description" rows="5" columns="30" required maxlength="150"></textarea><br>
            <label for="finishdate">Дэдлайн: </label>
            <input required  type="date" id="finishdate" name="finishdate" v-model="finishdate" placeholder="дд.мм.гггг"/>
            <button type="submit">Создать задачу</button>
        </form>
    </div>
    </div>
    </div>
    </section>
    `,
    data(){
        return{
            title: null,
            description: null,
            date: null,
            finishdate: null,
            reason: [],
        }
    },
    methods:{
        onSubmit() {
            let card = {
                title: this.title,
                description: this.description,
                date: new Date().toLocaleDateString().split('.').reverse().join('-'),
                finishdate: this.finishdate,
                edit: null,
                editB:null,
                reason: [],
                transfer: false,
                comdate: null,
                current: true,
                
            }
            eventBus.$emit('addColumn1', card)
            this.title = null
            this.description = null
            this.date = null
            this.finishdate = null
            console.log(card)
        },
    }
})



let app = new Vue({
    el: '#app',
    data: {
        name: 'Kanban доска'
    }
})