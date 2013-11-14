#include <node.h>
#include <v8.h>

#include <stdio.h>
#include <math.h>
#include <alsa/asoundlib.h>

using namespace v8;

Handle<Value> getSystemVolume(const Arguments& args) {
    HandleScope scope;

    snd_mixer_t *handle;
    snd_mixer_selem_id_t *sid;
    const char *card = "default";
    const char *selem_name = "Master";

    snd_mixer_open(&handle, 0);
    snd_mixer_attach(handle, card);
    snd_mixer_selem_register(handle, NULL, NULL);
    snd_mixer_load(handle);

    snd_mixer_selem_id_alloca(&sid);
    snd_mixer_selem_id_set_index(sid, 0);
    snd_mixer_selem_id_set_name(sid, selem_name);
    snd_mixer_elem_t* elem = snd_mixer_find_selem(handle, sid);

    snd_mixer_selem_set_playback_volume_range(elem, 0, 100);

    long curr;

    snd_mixer_selem_get_playback_volume(elem,(snd_mixer_selem_channel_id_t) 0, &curr);

    snd_mixer_close(handle);

    return scope.Close(Number::New(curr));
}

Handle<Value> setSystemVolume(const Arguments& args) {
    HandleScope scope;

    snd_mixer_t *handle;
    snd_mixer_selem_id_t *sid;
    const char *card = "default";
    const char *selem_name = "Master";
    long volume = args[0]->ToNumber()->Value();

    snd_mixer_open(&handle, 0);
    snd_mixer_attach(handle, card);
    snd_mixer_selem_register(handle, NULL, NULL);
    snd_mixer_load(handle);

    snd_mixer_selem_id_alloca(&sid);
    snd_mixer_selem_id_set_index(sid, 0);
    snd_mixer_selem_id_set_name(sid, selem_name);
    snd_mixer_elem_t* elem = snd_mixer_find_selem(handle, sid);

    snd_mixer_selem_set_playback_volume_range(elem, 0, 100);

    snd_mixer_selem_set_playback_volume_all(elem, volume);

    snd_mixer_close(handle);

    return scope.Close(Boolean::New("True"));
}

void init(Handle<Object> target) {
    target->Set(String::NewSymbol("getSystemVolume"),
              FunctionTemplate::New(getSystemVolume)->GetFunction());
    target->Set(String::NewSymbol("setSystemVolume"),
              FunctionTemplate::New(setSystemVolume)->GetFunction());
}
NODE_MODULE(nodealsa, init)
