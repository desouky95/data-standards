ifeq ($(OS),Windows_NT)
SHELL := powershell.exe
.SHELLFLAGS := -NoProfile -Command
endif
DATADIR = ./data
current_dir = $(CURDIR)
WSL := wsl
define moveFiles 
	@echo Moving $(1) to $(2) ...
	powershell move  $(DATADIR)/$(strip $(1)) $(DATADIR)/$(strip $(2)) -Force
	@echo Move completed.
endef


# $(call moveFiles,fifa.new.csv,fifa.csv)
all : setup
setup :
	./node_modules/.bin/ts-node utils/setupData.ts
fifa:
	npx ts-node utils/normalizeCsv.ts Country data/fifa.csv
ioc :
	npx ts-node utils/normalizeCsv.ts Country < data/olympics_codes.csv > data/olympics_codes.new.csv
	$(call moveFiles,olympics_codes.new.csv,olympics_codes.csv)

.PHONY: all


