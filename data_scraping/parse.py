with open("data.txt") as f:
	content = f.readlines()
output = {}
for line in content:
	output[line.split()[1]] = line.split()[8]
print(output)
print(len(output))
