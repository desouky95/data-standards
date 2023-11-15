ifeq ($(OS),Windows_NT)
SHELL := powershell.exe
endif

all : get-data
get-data:
	./../../node_modules/.bin/ts-node src/taks/getData.ts