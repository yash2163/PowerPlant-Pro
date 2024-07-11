function changeColor() {
    let container = document.getElementById('cont2'); // Corrected the ID
    if(container.style.backgroundColor != 'purple'){
        container.style.backgroundColor = 'purple';
    }
    else{
        container.style.backgroundColor = 'blue'
    }
    // container.style.backgroundColor = 'purple'; // Corrected the property name and added quotes around 'white'
}