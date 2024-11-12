import React from 'react'

export const home = () => {
  return (
    <div class="login-container">
    <h1>CalTasks</h1>
    <form>
        <input type="text" placeholder="Username" />
        <input type="password" placeholder="Password" />
        <button type="submit">Login</button>
    </form>
</div>
  )
}
