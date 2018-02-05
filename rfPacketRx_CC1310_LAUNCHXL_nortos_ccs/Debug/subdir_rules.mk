################################################################################
# Automatically-generated file. Do not edit!
################################################################################

# Each subdirectory must supply rules for building sources it contributes
CC1310_LAUNCHXL.obj: ../CC1310_LAUNCHXL.c $(GEN_OPTS) | $(GEN_HDRS)
	@echo 'Building file: "$<"'
	@echo 'Invoking: ARM Compiler'
	"/Applications/ti/ccsv7/tools/compiler/ti-cgt-arm_16.9.6.LTS/bin/armcl" -mv7M3 --code_state=16 --float_support=vfplib -me --include_path="/Users/andrewphung/workspace_v7/rfPacketRx_CC1310_LAUNCHXL_nortos_ccs" --include_path="/Users/andrewphung/ti/simplelink_cc13x0_sdk_1_60_00_21/source" --include_path="/Users/andrewphung/ti/simplelink_cc13x0_sdk_1_60_00_21/kernel/nortos" --include_path="/Users/andrewphung/ti/simplelink_cc13x0_sdk_1_60_00_21/kernel/nortos/posix" --include_path="/Applications/ti/ccsv7/tools/compiler/ti-cgt-arm_16.9.6.LTS/include" --define=DeviceFamily_CC13X0 -g --diag_warning=225 --diag_warning=255 --diag_wrap=off --display_error_number --gen_func_subsections=on --preproc_with_compile --preproc_dependency="CC1310_LAUNCHXL.d_raw" $(GEN_OPTS__FLAG) "$<"
	@echo 'Finished building: "$<"'
	@echo ' '

RFQueue.obj: ../RFQueue.c $(GEN_OPTS) | $(GEN_HDRS)
	@echo 'Building file: "$<"'
	@echo 'Invoking: ARM Compiler'
	"/Applications/ti/ccsv7/tools/compiler/ti-cgt-arm_16.9.6.LTS/bin/armcl" -mv7M3 --code_state=16 --float_support=vfplib -me --include_path="/Users/andrewphung/workspace_v7/rfPacketRx_CC1310_LAUNCHXL_nortos_ccs" --include_path="/Users/andrewphung/ti/simplelink_cc13x0_sdk_1_60_00_21/source" --include_path="/Users/andrewphung/ti/simplelink_cc13x0_sdk_1_60_00_21/kernel/nortos" --include_path="/Users/andrewphung/ti/simplelink_cc13x0_sdk_1_60_00_21/kernel/nortos/posix" --include_path="/Applications/ti/ccsv7/tools/compiler/ti-cgt-arm_16.9.6.LTS/include" --define=DeviceFamily_CC13X0 -g --diag_warning=225 --diag_warning=255 --diag_wrap=off --display_error_number --gen_func_subsections=on --preproc_with_compile --preproc_dependency="RFQueue.d_raw" $(GEN_OPTS__FLAG) "$<"
	@echo 'Finished building: "$<"'
	@echo ' '

ccfg.obj: ../ccfg.c $(GEN_OPTS) | $(GEN_HDRS)
	@echo 'Building file: "$<"'
	@echo 'Invoking: ARM Compiler'
	"/Applications/ti/ccsv7/tools/compiler/ti-cgt-arm_16.9.6.LTS/bin/armcl" -mv7M3 --code_state=16 --float_support=vfplib -me --include_path="/Users/andrewphung/workspace_v7/rfPacketRx_CC1310_LAUNCHXL_nortos_ccs" --include_path="/Users/andrewphung/ti/simplelink_cc13x0_sdk_1_60_00_21/source" --include_path="/Users/andrewphung/ti/simplelink_cc13x0_sdk_1_60_00_21/kernel/nortos" --include_path="/Users/andrewphung/ti/simplelink_cc13x0_sdk_1_60_00_21/kernel/nortos/posix" --include_path="/Applications/ti/ccsv7/tools/compiler/ti-cgt-arm_16.9.6.LTS/include" --define=DeviceFamily_CC13X0 -g --diag_warning=225 --diag_warning=255 --diag_wrap=off --display_error_number --gen_func_subsections=on --preproc_with_compile --preproc_dependency="ccfg.d_raw" $(GEN_OPTS__FLAG) "$<"
	@echo 'Finished building: "$<"'
	@echo ' '

main_nortos.obj: ../main_nortos.c $(GEN_OPTS) | $(GEN_HDRS)
	@echo 'Building file: "$<"'
	@echo 'Invoking: ARM Compiler'
	"/Applications/ti/ccsv7/tools/compiler/ti-cgt-arm_16.9.6.LTS/bin/armcl" -mv7M3 --code_state=16 --float_support=vfplib -me --include_path="/Users/andrewphung/workspace_v7/rfPacketRx_CC1310_LAUNCHXL_nortos_ccs" --include_path="/Users/andrewphung/ti/simplelink_cc13x0_sdk_1_60_00_21/source" --include_path="/Users/andrewphung/ti/simplelink_cc13x0_sdk_1_60_00_21/kernel/nortos" --include_path="/Users/andrewphung/ti/simplelink_cc13x0_sdk_1_60_00_21/kernel/nortos/posix" --include_path="/Applications/ti/ccsv7/tools/compiler/ti-cgt-arm_16.9.6.LTS/include" --define=DeviceFamily_CC13X0 -g --diag_warning=225 --diag_warning=255 --diag_wrap=off --display_error_number --gen_func_subsections=on --preproc_with_compile --preproc_dependency="main_nortos.d_raw" $(GEN_OPTS__FLAG) "$<"
	@echo 'Finished building: "$<"'
	@echo ' '

rfPacketRx_nortos.obj: ../rfPacketRx_nortos.c $(GEN_OPTS) | $(GEN_HDRS)
	@echo 'Building file: "$<"'
	@echo 'Invoking: ARM Compiler'
	"/Applications/ti/ccsv7/tools/compiler/ti-cgt-arm_16.9.6.LTS/bin/armcl" -mv7M3 --code_state=16 --float_support=vfplib -me --include_path="/Users/andrewphung/workspace_v7/rfPacketRx_CC1310_LAUNCHXL_nortos_ccs" --include_path="/Users/andrewphung/ti/simplelink_cc13x0_sdk_1_60_00_21/source" --include_path="/Users/andrewphung/ti/simplelink_cc13x0_sdk_1_60_00_21/kernel/nortos" --include_path="/Users/andrewphung/ti/simplelink_cc13x0_sdk_1_60_00_21/kernel/nortos/posix" --include_path="/Applications/ti/ccsv7/tools/compiler/ti-cgt-arm_16.9.6.LTS/include" --define=DeviceFamily_CC13X0 -g --diag_warning=225 --diag_warning=255 --diag_wrap=off --display_error_number --gen_func_subsections=on --preproc_with_compile --preproc_dependency="rfPacketRx_nortos.d_raw" $(GEN_OPTS__FLAG) "$<"
	@echo 'Finished building: "$<"'
	@echo ' '


