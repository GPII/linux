from smartcard.System import readers

# define the APDUs used in this script
SELECT = [0x00, 0xA4, 0x04, 0x00, 0x0A, 0xA0, 0x00, 0x00, 0x00, 0x62,
    0x03, 0x01, 0x0C, 0x06, 0x01]
COMMAND = [0x00, 0x00, 0x00, 0x00]

# get all the available readers
r = readers()
print "Available readers:", r

reader = r[0]
print "Using:", reader

connection = reader.createConnection()
connection.connect()


# data, sw1, sw2 = connection.transmit(SELECT)
# print data
# print "Select Applet: %02X %02X" % (sw1, sw2)

# data, sw1, sw2 = connection.transmit(COMMAND)
# print data
# print "Command: %02X %02X" % (sw1, sw2)

def print_result(data,sw1,sw2):
    print "Command: %02X %02X %s" % (sw1, sw2, data)

# Read value block 0x05

#Load a key into location 0x00
load_key = [0xFF, 0x82, 0x00, 0x00, 0x06, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF]
data, sw1, sw2 = connection.transmit(load_key)
print_result(data,sw1,sw2)


def read_block(blocknum,useauth=True):
    if useauth:
        # To authenticate the Block 0x04 with a {TYPE A, key number 0x00}. For PC/SC V2.07
        auth_block = [0xFF, 0x86, 0x00, 0x00, 0x05, 0x01, 0x00, blocknum, 0x61, 0x00]
        data, sw1, sw2 = connection.transmit(auth_block)
        #print_result(data,sw1,sw2)
    
    read_block_4 = [0xFF,0xB0,0x00,blocknum,0x0F]
    data, sw1, sw2 = connection.transmit(read_block_4)
    #print_result(data,sw1,sw2)
    return data

for block in range(0,20):
    data = read_block(block,False)
    s = ""
    for i in data:
        s = s+chr(i)
    print "%s %s %s" % (block,s,data)


