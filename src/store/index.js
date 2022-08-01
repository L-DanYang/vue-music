import { createStore ,createLogger} from 'vuex'
import state from './state'
import mutations from './mutations'
import * as getters from './getters'
import * as actions from './actions'

const debug = process.env.NODE_ENV !== 'production'

export default createStore({
  state ,
  getters ,
  mutations ,
  actions ,
  strict:debug,
  plugins:debug ? [createLogger()] :[]
})

// vuex提供给我们一个logger插件，我们在开发环境下可以用它看一下我们提交的情况
// // const debug = process.env.NODE_ENV !== 'production'
// 这就是debug环境，开发环境，是开发环境的话就启用一个logger插件,
// 严格模式，set提交mutation

