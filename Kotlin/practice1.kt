fun sum(a:Int , b:Int):Int{
    return a+b
}

fun menu(op:Int):String{
    val result = when(op){
        1 -> "Biryani"
        2 -> "Pizza"
        3 -> "Burger"
        else -> "Not available"
    }  
    return result
}

fun main(){
println(sum(12,34))
println(menu(7))
}


===========================================
fun evenOrOddNumber(no :Int){
    if(no%2==0) return println("$no is a even number") else return println("$no is a even number")
}
fun main(){
    evenOrOddNumber(234)
}

=============================================

fun primeNumber(no:Int){
    var flag=false
    for(i in 2..no/2){
        if(no%i==0){
            flag = true
            break
        }
    } 
    if (!flag) return println("$no is prime") else return println("$no is not a prime")
}

fun primeNumberW(no :Int ){
    var i=2
    var flag =false
    while(i<=no/2){
        if (no%i==2){
            flag=true
        }
        i++
    }
    if (!flag) return println("$no is prime") else return println("$no is not a prime")
}

fun main(){
    primeNumber(31)
    primeNumberW(32)
}

-------------------------------------------
//  Lambda Function
fun sum(a:Int,b:Int):Int = a+b 

fun main() {
   val sub = {x:Int,y:Int -> x-y} 
   println(sub(50,30))
  println(sum(12,12))
}