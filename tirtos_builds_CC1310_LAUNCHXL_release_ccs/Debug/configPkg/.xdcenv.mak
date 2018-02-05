#
_XDCBUILDCOUNT = 
ifneq (,$(findstring path,$(_USEXDCENV_)))
override XDCPATH = /Users/andrewphung/ti/simplelink_cc13x0_sdk_1_60_00_21/source;/Users/andrewphung/ti/simplelink_cc13x0_sdk_1_60_00_21/kernel/tirtos/packages;/Applications/ti/ccsv7/ccs_base
override XDCROOT = /Applications/ti/xdctools_3_50_04_43_core
override XDCBUILDCFG = ./config.bld
endif
ifneq (,$(findstring args,$(_USEXDCENV_)))
override XDCARGS = 
override XDCTARGETS = 
endif
#
ifeq (0,1)
PKGPATH = /Users/andrewphung/ti/simplelink_cc13x0_sdk_1_60_00_21/source;/Users/andrewphung/ti/simplelink_cc13x0_sdk_1_60_00_21/kernel/tirtos/packages;/Applications/ti/ccsv7/ccs_base;/Applications/ti/xdctools_3_50_04_43_core/packages;..
HOSTOS = MacOS
endif
