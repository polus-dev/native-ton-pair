build:
	@bash build.sh
	@echo ""
	@bash lp-token/build.sh
	@echo ""
	@fift -s fift/code-to-boc.fif