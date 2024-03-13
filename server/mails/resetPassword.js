const resetPasswordMail = (name, link) =>{
    return `<h1>Kedves ${name}</h1>
    <p>A jelszava megváltoztatásához kattintson az alábbi linkre: </p>
    <a href="${link}">${link}</a>`
}

module.exports = {resetPasswordMail}