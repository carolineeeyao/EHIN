################################################################################
# Automatically-generated file. Do not edit!
################################################################################

# Each subdirectory must supply rules for building sources it contributes
build-1317695535:
	@$(MAKE) --no-print-directory -Onone -f subdir_rules.mk build-1317695535-inproc

build-1317695535-inproc: ../release.cfg
	@echo 'Building file: "$<"'
	@echo 'Invoking: XDCtools'
	"/Applications/ti/xdctools_3_50_04_43_core/xs" --xdcpath="/Users/andrewphung/ti/simplelink_cc13x0_sdk_1_60_00_21/source;/Users/andrewphung/ti/simplelink_cc13x0_sdk_1_60_00_21/kernel/tirtos/packages;/Applications/ti/ccsv7/ccs_base;" xdc.tools.configuro -o configPkg -t ti.targets.arm.elf.M3 -p ti.platforms.simplelink:CC1310F128 -r release -c "/Applications/ti/ccsv7/tools/compiler/ti-cgt-arm_16.9.6.LTS" --compileOptions " -DDeviceFamily_CC13X0 " "$<"
	@echo 'Finished building: "$<"'
	@echo ' '

configPkg/linker.cmd: build-1317695535 ../release.cfg
configPkg/compiler.opt: build-1317695535
configPkg/: build-1317695535


