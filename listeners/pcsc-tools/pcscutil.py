from smartcard.System import readers
import sys

# get all the available readers
r = readers()

reader = r[0]

connection = reader.createConnection()
connection.connect()

def print_result(data,sw1,sw2):
    print "Command: %02X %02X %s" % (sw1, sw2, data)

#Load a key into location 0x00
load_key = [0xFF, 0x82, 0x00, 0x00, 0x06, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF]
data, sw1, sw2 = connection.transmit(load_key)

def get_tag_model(tagconn):
    """Returns a tuple containing the model byte codes, and then human readable name.
    ie. ([0x00,0x01],"Mifare 1K")
    """
    atr = tagconn.getATR()
    model = atr[13:15]
    if model[0] == 0x00 and model[1] == 0x01:
        return (model,"Mifare 1K")
    elif model[0] == 0x00 and model[1] == 0x02:
        return (model,"Mifare 4K")
    elif model[0] == 0x00 and model[1] == 0x03:
        return (model,"Mifare Ultralight")
    elif model[0] == 0x00 and model[1] == 0x26:
        return (model,"Mifare Mini")
    else:
        raise NotImplementedError("We don't support this card model yet: [%02x,%02x]" % (model[0],model[1]))

def read_block(tagconn,blocknum,useauth=True):
    if useauth:
        # To authenticate the Block 0x04 with a {TYPE A, key number 0x00}. For PC/SC V2.07
        auth_block = [0xFF, 0x86, 0x00, 0x00, 0x05, 0x01, 0x00, blocknum, 0x61, 0x00]
        data, sw1, sw2 = tagconn.transmit(auth_block)
        #print_result(data,sw1,sw2)
    
    read_block = [0xFF,0xB0,0x00,blocknum,0x10]
    data, sw1, sw2 = tagconn.transmit(read_block)
    return data

def ultralight_page(pagenum):
    read_block = [0xFF,0xB0,0x00,blocknum,0x0F]
    data, sw1, sw2 = connection.transmit(read_block)
    #print_result(data,sw1,sw2)
    return data
    
def dump_blocks(tagconn):
    """Dumps the blocks from the tag to screen for debugging. Currently we're
    only dumping enough blocks to take a look at where we would write our token.
    """
    for block in range(0,20):
        data = read_block(tagconn,block,True)
        s = ""
        for i in data:
            s = s+chr(i)
        print "%s %s %s" % (block,s,data)
    
def token_bytes_gen(token):
    """This is a generator that will return the characters of the token as
    bytes, and after that return 0's to pad out the memory blocks
    """
    cur = 0
    while 1:
        if cur < len(token):
            yield ord(token[cur])
            cur = cur+1
        else:
            yield 0

def get_gpii_token(tagconn):
    token = ""
    for i in range(4,7):
        block = read_block(tagconn,i)
        j = 0
        if i == 4:
            j = 9
        for byte in block[j:]:
            if byte == 0:
                return token
            token = token + chr(byte)
    return token

def write_gpii_token(tagconn,token):    
    tokgen = token_bytes_gen(token)
    for i in range(4,7):
        block = read_block(tagconn,i)
        print block
        j = 0
        if i == 4:
            j = 9
        while j < len(block): 
            block[j] = tokgen.next()
            j = j+1
        apdu = [0xFF,0xD6,0x00,i,0x10]
        apdu.extend(block)
        print block
        print apdu
        data, sw1, sw2 = tagconn.transmit(apdu)
        print_result(data,sw1,sw2)
        print "\n"

def main(args):
    """
This is a simple utility for performing operations on a NFC Tag
Reader and working with them for use in the GPII Project.

Usage:
pcscutil get model
    Print tag model

pcscutil get gpiitoken
    Print current GPII token

pcscutil set gpiitoken newtoken
    Set newtoken as GPII Token on tag.

pcscutil dumpblocks
    Dump ascii and byte values for blocks on tag.

pcscutil help
    Print this help
    """
    if len(args) == 2 and args[0]=="get" and args[1]=="model":
        print get_tag_model(connection)[1]
    elif len(args) == 2 and args[0]=="get" and args[1]=="gpiitoken":
        print get_gpii_token(connection)
    elif len(args) == 3 and args[0]=="set" and args[1]=="gpiitoken":
        write_gpii_token(connection,args[2])
    elif len(args) == 1 and args[0]=="dumpblocks":
        dump_blocks(connection)
    else:
        print main.__doc__

if __name__ == "__main__":    
    main(sys.argv[1:])
