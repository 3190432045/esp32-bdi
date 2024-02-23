/*
//=============================================================================
//
// Purpose: Bluetooth device interface for ESP32
//
// $NoKeywords: $
//=============================================================================
*/

/*
// bdi.h
*/

/*
=================
last modified: 2024/2/23
=================
*/


#ifndef __BDI__
#define __BDI__

#ifdef __cplusplus
extern "C"
{
#endif

#include <stdint.h>

void bdi_port_init();
void bdi_begin_advertising();
void bdi_write_bytes();
void bdi_read_bytes();
void bdi_destroy();

#ifdef __cplusplus
}
#endif


#endif  /*__BDI__*/
