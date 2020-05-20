#files that need to be added after installation:
#workdir/secret/password  <--- if using UP.sh
#docker-compose.yml       <--- if using UP.sh

WORKDIR=$(CURDIR)/workdir

DEVDIR=$(WORKDIR)/developer

APPBUILDER_BASE= \
	$(DEVDIR)/app_builder \
	$(DEVDIR)/appdev-core \
	$(DEVDIR)/appdev-opsportal \

APPBUILDER_SERVICES= \
	$(DEVDIR)/notification_email \
	$(DEVDIR)/process_manager 

PROJECTS=$(APPBUILDER_BASE) $(APPBUILDER_SERVICES)

GIT_OPTIONS=--recurse-submodules --depth 1 --shallow-submodules --quiet

GIT_BRANCH=--single-branch --branch develop

all: rebuild

rebuild: $(PROJECTS)
	#cd $(DEVDIR)/app_builder ; npm run build
	docker run --mount type=bind,source="$(DEVDIR)/app_builder",target=/app -w /app node:6.12.3 npm run build

$(WORKDIR):
	git clone $(GIT_OPTIONS) https://github.com/Hiro-Nakamura/ab_runtime_v1.git $(WORKDIR)
	cd $(WORKDIR) ; npm install
	docker run --mount type=bind,source="$(WORKDIR)/app",target=/app \
		--mount type=bind,source="$(WORKDIR)/resources/scripts/unTar.sh",target=/app/unTar.sh \
		skipdaddy/install-ab:developer_v2 ./unTar.sh 1>/dev/null 2>&1

$(DEVDIR): $(WORKDIR)
	@echo "Creating working path: $@"
	@mkdir -p $(DEVDIR)

$(APPBUILDER_BASE): $(DEVDIR)
	@echo ""
	@echo "==========================================================================================="
	@echo "Installing $(notdir $@)"
	git clone $(GIT_OPTIONS) $(GIT_BRANCH) https://github.com/appdevdesigns/$(notdir $@).git $@
	#cd $@ ; npm install --silent --no-progress 1>/dev/null 2>/dev/null
	@echo "Running npm install for $(notdir $@)"
	-docker run --mount type=bind,source="$@",target=/app -w /app node npm install

$(APPBUILDER_SERVICES): $(DEVDIR)
	@echo ""
	@echo "==========================================================================================="
	@echo "Installing $(notdir $@)"
	git clone $(GIT_OPTIONS) https://github.com/appdevdesigns/ab_service_$(notdir $@).git $@
	#cd $@ ; npm install --silent --no-progress 1>/dev/null 2>/dev/null
	@echo "Running npm install for $(notdir $@)"
	-docker run --mount type=bind,source="$@",target=/app -w /app node npm install --silent

clean:
	rm -rf $(WORKDIR)




