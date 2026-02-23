name = input("Please enter your name: ")
age = int(input("Please enter your age: "))
print("")

option=input("Do you what to change the details Y or N ")

if option.lower()=='y':
    detail=input("What you have to change select specifically name or age ")
    if detail.lower()=='name':
        name=input("Please enter the your name: ")
    elif detail.lower()=='age':
        age = int(input("Please enter your age: "))
    else:
        name=input("Please enter the your name: ")
        age = int(input("Please enter your age: "))
elif option.lower()=='n':
    print("You details are submitted")
else :
    print("You have enter wrong option you have to start again !!")

print("")  


if  18< age < 65:
    print("Congratulation you are eligible for the work !!")
    print("")
    print(f"Hello {name} welcome to Bizmatics ")
else :
    print("Sorry you are not eligible for the work!!")
print("")


'''
char = input("Enter a single character: ")

if len(char) != 1:
    print("Please enter exactly one character.")
elif char.lower() in 'aeiou':
    print(f"{char} is a vowel.")
elif char.isalpha():
    print(f"{char} is a consonant.")
elif char.isdigit():
    print(f"{char} is a digit.")
else:
    print(f"{char} is a special character.")
'''
