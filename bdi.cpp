
/*
// bdi.cpp
*/

/*
=================
last modified: 2024/2/23
=================
*/

#include <stdio.h>
#include <stdint.h>
#include "bdi.h"

#ifdef WIN32
#include <windows.h>
#else
#include <unistd.h>
#endif

static bdi_port_t state;

void bdi_port_init(bdi_port_t state_init)
{
    state = state_init;
    printf("msg_bdi_port_init");
}

void bdi_begin_advertising()
{
    printf("msg_bdi_begin_advertising");
}

void bdi_write_bytes(const byte *data, int len)
{
    printf("msgbdi_write_bytes: %s", data);
}

void bdi_read_bytes(byte *data, int len)
{

}

int bdi_shutdown()
{
    printf("msg_bdi_shutdown");
    return 0;
}

