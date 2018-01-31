################################################################################
# Automatically-generated file. Do not edit!
################################################################################

SHELL = cmd.exe

# Each subdirectory must supply rules for building sources it contributes
build-1317695535:
	@$(MAKE) -Onone -f subdir_rules.mk build-1317695535-inproc

build-1317695535-inproc: ../release.cfg
	@echo 'Building file: $<'
	@echo 'Invoking: XDCtools'
	"C:/ti/xdctools_3_50_03_33_core/xs" --xdcpath="C:/ti/simplelink_cc13x0_sdk_1_50_00_08/source;C:/ti/simplelink_cc13x0_sdk_1_50_00_08/kernel/tirtos/packages;C:/ti/ccsv7/ccs_base;" xdc.tools.configuro -o configPkg -t ti.targets.arm.elf.M3 -p ti.platforms.simplelink:CC1310F128 -r release -c "C:/ti/ccsv7/tools/compiler/ti-cgt-arm_16.9.4.LTS" --compileOptions " -DDeviceFamily_CC13X0 " "$<"
	@echo 'Finished building: $<'
	@echo ' '

configPkg/linker.cmd: build-1317695535 ../release.cfg
configPkg/compiler.opt: build-1317695535
configPkg/: build-1317695535


