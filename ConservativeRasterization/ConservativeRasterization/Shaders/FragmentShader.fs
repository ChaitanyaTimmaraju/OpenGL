#version 450 core

in vec2 v_pos;
in vec4 v_aabb;


in vec4 v_color;

out vec4 fragColor;
void main(void)
{
	// Discard pixels, which are not inside the AABB.
	if (v_pos.x < v_aabb.x || v_pos.y < v_aabb.y || v_pos.x > v_aabb.z || v_pos.y > v_aabb.w)
	{
		//discarded pixels in white
		fragColor=vec4(1.0);
	}else
	{
	fragColor = v_color;
	}

}