arr = [1,123,1,2,5,14,2,41,5,1]
try:
    index = int(input("Enter index you want to modify: "))
    value = int(input("Enter value to replace: "))
    arr[index] = value
except IndexError:
    print("Index does not exist")
except ValueError:
    print("Please enter numbers only")
finally:
    print("Modified array is",arr)